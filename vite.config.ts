// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';

export default defineConfig({
    plugins: [vue(), vueJsx()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'KthirtyBpmnVue',
            fileName: (format) => `kthirty-bpmn-vue.${format}.js`
        },
        rollupOptions: {
            external: ['vue', 'ant-design-vue', 'bpmn-js', 'vue-i18n'],
            output: {
                globals: {
                    vue: 'Vue',
                    'ant-design-vue': 'AntDesignVue',
                    'bpmn-js': 'BpmnJS',
                    'vue-i18n': 'VueI18n'
                }
            }
        }
    }
});
