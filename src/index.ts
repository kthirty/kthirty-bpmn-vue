// src/index.ts
import { App, Plugin } from 'vue';
import Index from './components/Designer';
import Panel from './components/Panel';
import Toolbar from './components/Toolbar/index';
import BpmnDesigner from './components/BpmnDesigner';

export { Index, Panel, Toolbar, BpmnDesigner };

const install: Plugin = (app: App) => {
    app.component('Designer', Index);
    app.component('Panel', Panel);
    app.component('Toolbar', Toolbar);
    app.component('BpmnDesigner', BpmnDesigner);
};

export default install;
