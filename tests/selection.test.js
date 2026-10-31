// @vitest-environment node
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { expect, it } from 'vitest';

it('keeps selection suppression in namespaced component rules without global opt-outs', async () => {
  const root = new URL('../src/css/', import.meta.url);
  const files = (await readdir(root, { recursive: true })).filter((file) =>
    file.endsWith('.css'),
  );
  let rules = 0;
  for (const file of files) {
    const css = await readFile(new URL(file, root), 'utf8');
    for (const block of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const declarations = [
        ...block[2].matchAll(/(-webkit-)?user-select\s*:\s*([^;]+);/g),
      ];
      if (!declarations.length) continue;
      const selector = block[1].replace(/\/\*[\s\S]*?\*\//g, '').trim();
      const context = `${file}: ${selector}`;
      expect(path.dirname(file), context).toBe('components');
      expect(declarations, context).toHaveLength(2);
      expect(
        declarations.map((match) => match[1] || ''),
        context,
      ).toEqual(expect.arrayContaining(['-webkit-', '']));
      const value = declarations[0][2].trim();
      expect(declarations[1][2].trim(), context).toBe(value);
      expect(['none', 'text'], context).toContain(value);
      expect(selector, context).not.toMatch(
        /\*|\bbody\b|\.oj-(?:root|app|site)\b/,
      );
      // Commas inside :where(), :not() or other selector functions do not
      // separate rules. Strip balanced function arguments before splitting.
      let topLevelSelectors = selector;
      while (/\([^()]*\)/.test(topLevelSelectors)) {
        topLevelSelectors = topLevelSelectors.replace(/\([^()]*\)/g, '');
      }
      for (const part of topLevelSelectors.split(',')) {
        expect(part, context).toMatch(/\.oj-[\w-]+/);
      }
      rules += 1;
    }
  }
  expect(rules).toBeGreaterThan(0);
});
