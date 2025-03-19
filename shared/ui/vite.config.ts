import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), viteTsConfigPaths(), dts(), svgr()],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'ui',
            fileName: (format) => `ui.${format}.js`, // modern browser(esm format), legacy browser(umd format)
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
});
