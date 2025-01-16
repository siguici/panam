import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    format: ['esm', 'cjs'],
    clean: true,
    minify: !options.watch,
    dts: true,
    entry: ['src/cli.ts', 'src/console.ts', 'src/index.ts', 'src/process.ts']
  };
});
