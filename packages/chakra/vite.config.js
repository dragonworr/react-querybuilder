import vitePluginReact from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  define: {
    __RQB_DEV__: command === 'build' ? 'false' : 'true',
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: format => `index.${format}.js`,
      formats: ['cjs', 'es'],
    },
    rollupOptions: {
      external: ['react', 'react-querybuilder', '@chakra-ui/react', '@chakra-ui/icons'],
    },
    sourcemap: true,
  },
  plugins: [
    vitePluginReact(),
    visualizer({ filename: 'build-stats.html', gzipSize: true, title: 'Build stats' }),
  ],
  server: {
    port: 3104,
  },
}));
