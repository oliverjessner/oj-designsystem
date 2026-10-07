import { execFileSync } from 'node:child_process';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';

const source = process.cwd();
const [pack] = JSON.parse(
  execFileSync('npm', ['pack', '--ignore-scripts', '--json'], {
    encoding: 'utf8',
  }),
);
const directory = await mkdtemp(path.join(os.tmpdir(), 'oj-packed-consumer-'));
try {
  for (const example of ['vanilla', 'website']) {
    const target = path.join(directory, example);
    await cp(path.join(source, 'examples', example), target, {
      recursive: true,
      filter: (file) => !/(?:^|\/)(?:node_modules|dist)(?:\/|$)/.test(file),
    });
    const pkg = JSON.parse(
      await readFile(path.join(target, 'package.json'), 'utf8'),
    );
    pkg.dependencies['oj-designsystem'] = pathToFileURL(
      path.join(source, pack.filename),
    ).href;
    await writeFile(
      path.join(target, 'package.json'),
      JSON.stringify(pkg, null, 2) + '\n',
    );
    execFileSync(
      'npm',
      ['install', '--ignore-scripts', '--no-audit', '--no-fund'],
      { cwd: target, stdio: 'pipe' },
    );
    execFileSync('npm', ['run', 'build'], { cwd: target, stdio: 'pipe' });
    execFileSync(
      'node',
      [
        '--input-type=module',
        '-e',
        `
      import assert from 'node:assert/strict';
      import { readFile } from 'node:fs/promises';
      const api = await import('oj-designsystem');
      for (const name of ['initOJ','initTabs','initDropdowns','initTooltips','initDialogs','openDialog','closeDialog','confirmDialog','toast']) assert.equal(typeof api[name], 'function');
      for (const name of ['styles.css','tokens.css','fonts.css','fontawesome.css']) await readFile(new URL(import.meta.resolve('oj-designsystem/'+name)));
      assert.equal(api.initOJ instanceof Function, true);
    `,
      ],
      { cwd: target, stdio: 'pipe' },
    );
    console.log(
      `Packed-package ${example} consumer: install, Vite production build and ESM/CSS exports passed.`,
    );
  }
} catch (error) {
  console.error(
    `Consumer verification workspace retained for debugging: ${directory}`,
  );
  throw error;
}
await rm(directory, { recursive: true, force: true });
