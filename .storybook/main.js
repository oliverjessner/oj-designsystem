import { fileURLToPath } from 'node:url';

export default {
  stories: ['../stories/**/*.stories.js'],
  addons: ['@storybook/addon-a11y'],
  framework: '@storybook/html-vite',
  core: { disableTelemetry: true },
  viteFinal(config) {
    const aliases = Array.isArray(config.resolve?.alias)
      ? config.resolve.alias
      : Object.entries(config.resolve?.alias || {}).map(
          ([find, replacement]) => ({
            find,
            replacement,
          }),
        );
    config.resolve = {
      ...config.resolve,
      alias: [
        {
          find: /^oj-designsystem\/styles\.css$/,
          replacement: fileURLToPath(
            new URL('../dist/styles.css', import.meta.url),
          ),
        },
        {
          find: /^oj-designsystem$/,
          replacement: fileURLToPath(
            new URL('../dist/index.js', import.meta.url),
          ),
        },
        ...aliases,
      ],
    };
    return config;
  },
};
