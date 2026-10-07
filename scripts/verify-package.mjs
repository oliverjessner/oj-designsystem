import { execFileSync } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';

const [pack] = JSON.parse(
  execFileSync('npm', ['pack', '--ignore-scripts', '--json'], {
    encoding: 'utf8',
  }),
);
const files = new Set(pack.files.map(({ path: file }) => file));
for (const file of [
  'dist/styles.css',
  'dist/index.js',
  'dist/index.d.ts',
  'dist/tokens.css',
  'dist/fonts.css',
  'dist/fontawesome.css',
  'README.md',
  'LICENSE',
  'THIRD-PARTY-NOTICES.md',
  'CHANGELOG.md',
  'dist/licenses/comfortaa-OFL.txt',
  'dist/licenses/jetbrains-mono-OFL.txt',
  'dist/licenses/fontawesome-free-LICENSE.txt',
]) {
  assert(files.has(file), `Missing packaged file: ${file}`);
}
assert(
  ![...files].some((file) =>
    /^(src|tests|stories|scripts|examples|node_modules|storybook-static)\//.test(
      file,
    ),
  ),
  'Unnecessary source/development files are packaged',
);
for (const cssFile of ['styles.css', 'fonts.css', 'fontawesome.css']) {
  const css = await readFile(`dist/${cssFile}`, 'utf8');
  assert(!/@import\b/.test(css), `Unresolved import in ${cssFile}`);
  assert(
    !/https?:\/\//.test(css.replace(/\/\*[\s\S]*?\*\//g, '')),
    `Runtime CDN URL in ${cssFile}`,
  );
  for (const [, raw] of css.matchAll(/url\(([^)]+)\)/g)) {
    const asset = raw.replace(/["']/g, '');
    const file = path.posix.normalize(path.posix.join('dist', asset));
    assert(files.has(file), `CSS asset absent from tarball: ${asset}`);
    assert((await stat(file)).size > 0, `Empty asset: ${file}`);
  }
}
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
for (const [name, value] of Object.entries(pkg.exports)) {
  if (name.includes('*')) continue;
  for (const target of typeof value === 'string'
    ? [value]
    : Object.values(value)) {
    assert(
      files.has(target.replace(/^\.\//, '')),
      `Export target is absent: ${name} -> ${target}`,
    );
  }
}
console.log(
  `Verified ${pack.filename}: ${files.size} files, ${(pack.size / 1024).toFixed(1)} KiB compressed; all exports, fonts/icons, notices and CSS paths present.`,
);
