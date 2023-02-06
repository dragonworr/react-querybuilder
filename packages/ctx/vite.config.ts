import vitePluginReact from '@vitejs/plugin-react-swc';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { name } from './package.json';

const packageAbbr = name.replace('@react-querybuilder/', '');

export default defineConfig(({ command }) => ({
  define: {
    __RQB_DEV__: command === 'build' ? 'false' : 'true',
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: format => `index.${format === 'es' ? 'm' : format === 'cjs' ? 'c' : 'umd.'}js`,
      formats: ['umd', 'cjs', 'es'],
      name: 'ReactQueryBuilderContext',
    },
    rollupOptions: {
      external: ['immer', 'react', 'react-querybuilder'],
      output: {
        globals: {
          immer: 'immer',
          react: 'React',
          'react-querybuilder': 'ReactQueryBuilder',
        },
        exports: 'named',
      },
    },
    sourcemap: true,
  },
  plugins: [
    vitePluginReact(),
    visualizer({
      filename: 'build-stats.html',
      gzipSize: true,
      title: `Build stats (${packageAbbr})`,
    }),
  ],
  server: {
    port: 3107,
  },
}));
