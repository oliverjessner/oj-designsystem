import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { verifyPackage } from './verify-package.mjs';
import { verifyConsumer } from './verify-consumer.mjs';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));

function runNpm(args, root) {
  const result = spawnSync('npm', args, { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(
      `npm ${args[0]} failed (${result.signal || result.status}). Release stopped.`,
    );
  }
}

async function integrity(file) {
  return `sha512-${createHash('sha512')
    .update(await readFile(file))
    .digest('base64')}`;
}

export async function publishPackage(options = {}, dependencies = {}) {
  const root = dependencies.root ?? projectRoot;
  const run = dependencies.run ?? runNpm;
  const pack = dependencies.verifyPackage ?? verifyPackage;
  const consumer = dependencies.verifyConsumer ?? verifyConsumer;
  const pkg = JSON.parse(
    await readFile(path.join(root, 'package.json'), 'utf8'),
  );
  if (pkg.private) throw new Error('A private package cannot be published.');
  const dryRun = Boolean(
    options.dryRun || process.env.npm_config_dry_run === 'true',
  );
  const tag = options.tag ?? (pkg.version.includes('-') ? 'next' : 'latest');
  if (!tag || tag.startsWith('-')) throw new Error('Provide a valid npm tag.');

  for (const script of [
    'lint',
    'format:check',
    'test',
    'build',
    'build-storybook',
    'test:browser',
  ]) {
    console.log(`\nRelease check: ${script}`);
    run(['run', script], root);
  }

  const artifact = await pack();
  if (artifact.name !== pkg.name || artifact.version !== pkg.version) {
    throw new Error('Packed name/version differs from package.json.');
  }
  const tarball = path.resolve(root, artifact.filename);
  if ((await integrity(tarball)) !== artifact.integrity) {
    throw new Error('Packed artifact integrity does not match.');
  }
  await consumer(tarball);
  if ((await integrity(tarball)) !== artifact.integrity) {
    throw new Error('Artifact changed during consumer verification.');
  }

  const args = [
    'publish',
    tarball,
    '--ignore-scripts',
    '--access',
    'public',
    '--registry',
    'https://registry.npmjs.org/',
    '--tag',
    tag,
    `--dry-run=${dryRun}`,
  ];
  console.log(
    `\n${dryRun ? 'Dry run' : 'Publishing'}: ${pkg.name}@${pkg.version} (${tag})`,
  );
  run(args, root);
  console.log(
    dryRun
      ? 'Dry run passed. No package was published.'
      : `Published ${pkg.name}@${pkg.version}.`,
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const { values } = parseArgs({
      options: {
        'dry-run': { type: 'boolean', default: false },
        tag: { type: 'string' },
        help: { type: 'boolean', short: 'h' },
      },
    });
    if (values.help) {
      console.log('Usage: npm run publish:npm -- [--dry-run] [--tag next]');
    } else {
      process.chdir(projectRoot);
      await publishPackage({ dryRun: values['dry-run'], tag: values.tag });
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
