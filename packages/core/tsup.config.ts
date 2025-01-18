import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    format: ['esm', 'cjs'],
    clean: true,
    minify: !options.watch,
    dts: true,
    entry: [
      'src/index.ts',
      'src/pm.ts',
      'src/process.ts',
      'src/runtime.ts',
      'src/utils.ts'
    ]
  };
});
