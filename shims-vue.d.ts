// shims-vue.d.ts

declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}
declare module "*.scss" {
    const classes: { readonly [key: string]: string };
    export default classes;
}