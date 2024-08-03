// example/vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';

export default defineConfig({
    plugins: [vue(), vueJsx()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src')
        }
    },
    root: path.resolve(__dirname),
    publicDir: path.resolve(__dirname, 'public'),
    build: {
        outDir: path.resolve(__dirname, 'dist')
    }
});
