import { App, Plugin } from 'vue';
import Designer from './components/Designer';
import Panel from './components/Panel';
import Toolbar from './components/Toolbar/index';
import BpmnDesigner from './components/BpmnDesigner';

export { Designer, Panel, Toolbar, BpmnDesigner };
export type { ComponentConfig } from './types';

const install: Plugin = (app: App) => {
    app.component('Designer', Designer);
    app.component('Panel', Panel);
    app.component('Toolbar', Toolbar);
    app.component('BpmnDesigner', BpmnDesigner);
};

export default install;
