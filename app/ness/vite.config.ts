import path from 'path';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
    base: '/ness/',
    plugins: [
        react(),
        reactRouter(),
        tsconfigPaths(),
        svgr(),
        tailwindcss(),
        viteStaticCopy({
            targets: [
                {
                    src: path.join(import.meta.dirname, 'node_modules', 'mediainfo.js', 'dist', 'MediaInfoModule.wasm'),
                    dest: '',
                },
            ],
        }),
    ],
    server: {
        port: 5173,
        fs: {
            allow: [searchForWorkspaceRoot(process.cwd()), '../../dist/MediaInfoModule.wasm'],
        },
    },
});
