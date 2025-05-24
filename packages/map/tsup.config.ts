import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  minify: true,
  target: 'es2019',
  sourcemap: true,
  dts: true,
  format: ['esm', 'cjs'],
  injectStyle: true,
  outDir: 'dist',
});
