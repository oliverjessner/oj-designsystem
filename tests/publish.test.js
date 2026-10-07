// @vitest-environment node
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { createHash } from 'node:crypto';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { publishPackage } from '../scripts/publish.mjs';

let root;
let artifact;
let dependencies;

beforeEach(async () => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  root = await mkdtemp(path.join(os.tmpdir(), 'oj-release-test-'));
  await writeFile(
    path.join(root, 'package.json'),
    JSON.stringify({ name: 'oj-designsystem', version: '0.1.0' }),
  );
  const contents = Buffer.from('verified package fixture');
  artifact = {
    name: 'oj-designsystem',
    version: '0.1.0',
    filename: 'oj-designsystem-0.1.0.tgz',
    integrity: `sha512-${createHash('sha512').update(contents).digest('base64')}`,
  };
  await writeFile(path.join(root, artifact.filename), contents);
  dependencies = {
    root,
    run: vi.fn(),
    verifyPackage: vi.fn(async () => artifact),
    verifyConsumer: vi.fn(async () => {}),
  };
});

afterEach(async () => {
  vi.unstubAllEnvs();
  await rm(root, { recursive: true, force: true });
});

test('publishes the verified consumer artifact only after every quality gate', async () => {
  await publishPackage({}, dependencies);
  expect(
    dependencies.run.mock.calls.slice(1, -1).map(([args]) => args),
  ).toEqual([
    ['run', 'lint'],
    ['run', 'format:check'],
    ['run', 'test'],
    ['run', 'build'],
    ['run', 'build-storybook'],
    ['run', 'test:browser'],
  ]);
  const tarball = path.join(root, artifact.filename);
  expect(dependencies.run).toHaveBeenNthCalledWith(
    1,
    ['whoami', '--registry', 'https://registry.npmjs.org/'],
    root,
  );
  expect(dependencies.verifyPackage).toHaveBeenCalledTimes(1);
  expect(dependencies.verifyConsumer).toHaveBeenCalledExactlyOnceWith(tarball);
  expect(dependencies.run).toHaveBeenLastCalledWith(
    [
      'publish',
      tarball,
      '--ignore-scripts',
      '--access',
      'public',
      '--registry',
      'https://registry.npmjs.org/',
      '--tag',
      'latest',
      '--dry-run=false',
    ],
    root,
  );
  expect(dependencies.run.mock.invocationCallOrder.at(-1)).toBeGreaterThan(
    dependencies.verifyConsumer.mock.invocationCallOrder[0],
  );
});

test('dry run still checks consumers and invokes only npm dry-run publication', async () => {
  await publishPackage({ dryRun: true, tag: 'beta' }, dependencies);
  expect(
    dependencies.run.mock.calls.some(([args]) => args[0] === 'whoami'),
  ).toBe(false);
  expect(dependencies.verifyConsumer).toHaveBeenCalledTimes(1);
  expect(dependencies.run.mock.calls.at(-1)[0]).toContain('--dry-run=true');
  expect(dependencies.run.mock.calls.at(-1)[0]).toContain('beta');
});

test('a rejected login stops before quality gates and packing', async () => {
  dependencies.run.mockImplementation((args) => {
    if (args[0] === 'whoami') throw new Error('E401 Unauthorized');
  });
  await expect(publishPackage({}, dependencies)).rejects.toThrow('npm login');
  expect(dependencies.run).toHaveBeenCalledTimes(1);
  expect(dependencies.verifyPackage).not.toHaveBeenCalled();
  expect(dependencies.verifyConsumer).not.toHaveBeenCalled();
});

test('a failed quality gate stops before packing or publishing', async () => {
  dependencies.run.mockImplementation((args) => {
    if (args[1] === 'test') throw new Error('Tests failed');
  });
  await expect(publishPackage({}, dependencies)).rejects.toThrow(
    'Tests failed',
  );
  expect(dependencies.verifyPackage).not.toHaveBeenCalled();
  expect(dependencies.verifyConsumer).not.toHaveBeenCalled();
  expect(
    dependencies.run.mock.calls.some(([args]) => args[0] === 'publish'),
  ).toBe(false);
});

test('a failed external consumer cannot publish', async () => {
  dependencies.verifyConsumer.mockRejectedValue(new Error('Consumer failed'));
  await expect(publishPackage({}, dependencies)).rejects.toThrow(
    'Consumer failed',
  );
  expect(
    dependencies.run.mock.calls.some(([args]) => args[0] === 'publish'),
  ).toBe(false);
});

test('altering the artifact during consumer verification prevents publication', async () => {
  dependencies.verifyConsumer.mockImplementation(async (tarball) => {
    await writeFile(tarball, 'unexpected replacement');
  });
  await expect(publishPackage({}, dependencies)).rejects.toThrow(
    'Artifact changed',
  );
  expect(
    dependencies.run.mock.calls.some(([args]) => args[0] === 'publish'),
  ).toBe(false);
});

test('a stale packed version is rejected before consumer verification', async () => {
  artifact.version = '0.0.1';
  await expect(publishPackage({}, dependencies)).rejects.toThrow(
    'name/version',
  );
  expect(dependencies.verifyConsumer).not.toHaveBeenCalled();
});

test('prereleases default to next instead of updating latest', async () => {
  artifact.version = '0.2.0-beta.1';
  await writeFile(
    path.join(root, 'package.json'),
    JSON.stringify({ name: artifact.name, version: artifact.version }),
  );
  await publishPackage({ dryRun: true }, dependencies);
  const args = dependencies.run.mock.calls.at(-1)[0];
  expect(args[args.indexOf('--tag') + 1]).toBe('next');
});

test('unknown CLI options fail before release work starts', () => {
  expect(() =>
    execFileSync(process.execPath, ['scripts/publish.mjs', '--skip-checks'], {
      cwd: process.cwd(),
      stdio: 'pipe',
    }),
  ).toThrow();
});

test('npm-level dry-run intent is preserved without a script argument', async () => {
  vi.stubEnv('npm_config_dry_run', 'true');
  await publishPackage({}, dependencies);
  expect(dependencies.run.mock.calls.at(-1)[0]).toContain('--dry-run=true');
  expect(
    dependencies.run.mock.calls.some(([args]) => args[0] === 'whoami'),
  ).toBe(false);
});
