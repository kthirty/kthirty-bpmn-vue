import { BaseViewerOptions } from 'bpmn-js/lib/BaseViewer'
import Translate from './modules/Translate'
import flowableModdleDescriptors from './descriptors/flowable.json'
import { CreateAppendAnythingModule } from 'bpmn-js-create-append-anything';
import BpmnColorPickerModule from 'bpmn-js-color-picker';
import lintModule from 'bpmn-js-bpmnlint'
import bpmnlint from './modules/bpmnlint'


const config: BaseViewerOptions = {
  additionalModules: [
    Translate,
    CreateAppendAnythingModule,
    BpmnColorPickerModule,
    lintModule
  ],
  moddleExtensions: {
    flowable: flowableModdleDescriptors,
  },
  keyboard: {
    bindTo: window
  },
  linting: {
    active: true,
    bpmnlint: bpmnlint
  }
}
export default config