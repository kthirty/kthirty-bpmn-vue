import { BaseViewerOptions } from 'bpmn-js/lib/BaseViewer'
import Translate from './modules/Translate'
import flowableModdleDescriptors from './descriptors/flowable.json'
import { CreateAppendAnythingModule } from 'bpmn-js-create-append-anything';
import BpmnColorPickerModule from 'bpmn-js-color-picker';

const config: BaseViewerOptions = {
  additionalModules: [
    Translate,
    CreateAppendAnythingModule,
    BpmnColorPickerModule
  ],
  moddleExtensions: {
    flowable: flowableModdleDescriptors,
  },
  keyboard: {
    bindTo: window
  }
}
export default config