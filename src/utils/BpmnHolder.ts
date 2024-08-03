import Modeler from 'bpmn-js/lib/Modeler'
import type Modeling from 'bpmn-js/lib/features/modeling/Modeling'
import { Element,Moddle } from 'bpmn-js/lib/model/Types'

(window as any).__kthirty = {}

export const getModeler = (): Modeler | undefined => (window as any)?.__kthirty?.modeler
export const setModeler = (modeler: Modeler | undefined) => {
    console.log('set modeler',modeler);
    (window as any).__kthirty.modeler = modeler
}
export const getModeling = ():Modeling | undefined => getModeler()?.get<Modeling>("modeling")
export const getModdle = ():Moddle | undefined => getModeler()?.get<Moddle>("moddle")
export const setProcessEngine = (processEngine:string) => (window as any).__kthirty.processEngine = processEngine
export const getProcessEngine = () : string => (window as any)?.__kthirty?.processEngine || 'flowable'
export const setCurrentElement = (currentElement: Element) => (window as any).__kthirty.currentElement = currentElement
export const getCurrentElement = () => (window as any).__kthirty.currentElement