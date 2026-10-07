import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
async function walk(dir) {
  const files = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      files.map((file) =>
        file.isDirectory()
          ? walk(path.join(dir, file.name))
          : path.join(dir, file.name),
      ),
    )
  ).flat();
}
const errors = [];
for (const file of (await walk('src/css')).filter((file) =>
  file.endsWith('.css'),
)) {
  const css = await readFile(file, 'utf8');
  if (/!important\b/.test(css))
    errors.push(`${file}: !important is not permitted`);
  for (const match of css.matchAll(/--([a-z][\w-]*)/gi)) {
    if (!match[1].startsWith('oj-'))
      errors.push(`${file}: unnamespaced custom property --${match[1]}`);
  }
  for (const block of css.matchAll(/([^{}]+)\{/g)) {
    const selector = block[1].replace(/\/\*[\s\S]*?\*\//g, '').trim();
    if (selector.startsWith('@')) continue;
    if (/#\w/.test(selector)) errors.push(`${file}: ID selector ${selector}`);
    for (const match of selector.matchAll(/\.([a-z][\w-]*)/gi)) {
      if (!match[1].startsWith('oj-'))
        errors.push(`${file}: unnamespaced class .${match[1]}`);
    }
  }
}
if (errors.length) throw new Error([...new Set(errors)].join('\n'));
console.log(
  'CSS namespace, specificity guardrails and no-important checks passed.',
);
