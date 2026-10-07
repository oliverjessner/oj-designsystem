import { build, transform } from 'esbuild';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = path.join(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, 'assets/fonts'), { recursive: true });
await mkdir(path.join(dist, 'assets/fontawesome'), { recursive: true });
await mkdir(path.join(dist, 'licenses'), { recursive: true });

async function bundleCSS(file, stack = []) {
  if (stack.includes(file)) throw new Error(`CSS import cycle: ${file}`);
  const source = await readFile(file, 'utf8');
  const imports = [...source.matchAll(/@import\s+['"]([^'"]+)['"]\s*;/g)];
  let output = source;
  for (const match of imports) {
    if (!match[1].startsWith('./'))
      throw new Error(
        `Only relative source CSS imports are permitted: ${match[1]}`,
      );
    const imported = path.resolve(path.dirname(file), match[1]);
    if (!imported.startsWith(path.join(root, 'src/css') + path.sep))
      throw new Error(`CSS import escapes source directory: ${imported}`);
    output = output.replace(
      match[0],
      await bundleCSS(imported, [...stack, file]),
    );
  }
  return output;
}

const fontawesome = path.join(
  root,
  'node_modules/@fortawesome/fontawesome-free',
);
let iconCSS = '';
for (const file of [
  'fontawesome.css',
  'solid.css',
  'regular.css',
  'brands.css',
]) {
  iconCSS +=
    (await readFile(path.join(fontawesome, 'css', file), 'utf8')).replaceAll(
      '../webfonts/',
      './assets/fontawesome/',
    ) + '\n';
}
const { version } = JSON.parse(
  await readFile(path.join(root, 'package.json'), 'utf8'),
);
const banner = `/*! oj-designsystem v${version} | MIT | Third-party notices: THIRD-PARTY-NOTICES.md */\n`;
async function writeCSS(name, source) {
  const output = await transform(source, {
    loader: 'css',
    minify: true,
    target: ['chrome120', 'safari17.4', 'firefox128'],
    legalComments: 'inline',
  });
  if (/@import\b/.test(output.code))
    throw new Error(`Unresolved CSS import in ${name}`);
  await writeFile(path.join(dist, name), banner + output.code);
}
await writeCSS(
  'styles.css',
  iconCSS + (await bundleCSS(path.join(root, 'src/css/styles.css'))),
);
await writeCSS(
  'tokens.css',
  await readFile(path.join(root, 'src/css/tokens.css'), 'utf8'),
);
await writeCSS(
  'fonts.css',
  await readFile(path.join(root, 'src/css/fonts.css'), 'utf8'),
);
await writeCSS('fontawesome.css', iconCSS);

const fontCSS = await readFile(path.join(root, 'src/css/fonts.css'), 'utf8');
for (const family of ['comfortaa', 'jetbrains-mono']) {
  const pkg = path.join(root, 'node_modules/@fontsource-variable', family);
  for (const file of await readdir(path.join(pkg, 'files'))) {
    if (fontCSS.includes(file))
      await cp(
        path.join(pkg, 'files', file),
        path.join(dist, 'assets/fonts', file),
      );
  }
  await cp(
    path.join(pkg, 'LICENSE'),
    path.join(dist, 'licenses', `${family}-OFL.txt`),
  );
}
for (const file of [
  'fa-solid-900.woff2',
  'fa-regular-400.woff2',
  'fa-brands-400.woff2',
]) {
  await cp(
    path.join(fontawesome, 'webfonts', file),
    path.join(dist, 'assets/fontawesome', file),
  );
}
await cp(
  path.join(fontawesome, 'LICENSE.txt'),
  path.join(dist, 'licenses/fontawesome-free-LICENSE.txt'),
);
await build({
  entryPoints: [path.join(root, 'src/js/index.js')],
  outfile: path.join(dist, 'index.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
  legalComments: 'none',
  banner: { js: banner.trim() },
});
await cp(path.join(root, 'src/js/index.d.ts'), path.join(dist, 'index.d.ts'));
console.log(
  'Built ESM, minified CSS, local WOFF2 fonts, Font Awesome and licenses.',
);
