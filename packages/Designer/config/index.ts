import type { BaseViewerOptions } from 'bpmn-js/lib/BaseViewer'
import Translate from './modules/Translate'
import flowableModdleDescriptors from './descriptors/flowable.json'
import activitieModdleDescriptors from './descriptors/activiti.json'
import { CreateAppendAnythingModule } from 'bpmn-js-create-append-anything'
import BpmnColorPickerModule from 'bpmn-js-color-picker'
import lintModule from 'bpmn-js-bpmnlint'
import bpmnlint from './modules/bpmnlint'

const config = getConfig('activiti')
export default config

export function getConfig(processEngine: string){
  const config: BaseViewerOptions = {
    additionalModules: [Translate, CreateAppendAnythingModule, BpmnColorPickerModule, lintModule],
    moddleExtensions: {},
    keyboard: {
      bindTo: window
    },
    linting: {
      active: true,
      bpmnlint: bpmnlint
    }
  }
  if (processEngine === 'flowable') config!.moddleExtensions!['flowable'] = flowableModdleDescriptors
  if (processEngine === 'activiti') config!.moddleExtensions!['activiti'] = activitieModdleDescriptors
  return config
}
