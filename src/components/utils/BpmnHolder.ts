import modelerStore from '../../store/modeler'
import Modeler from 'bpmn-js/lib/Modeler'
import { Element } from 'diagram-js/lib/model/Types'
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
import { Moddle } from 'bpmn-js/lib/model/Types'
import Modeling from 'bpmn-js/lib/features/modeling/Modeling'

export function getModeling(): Modeling | undefined {
  return modelerStore().getModeling
}

export function getModdle(): Moddle | undefined {
  return modelerStore().getModdle
}

export function getModeler(): Modeler | undefined {
  return modelerStore().getModeler
}

export function setModeler(modeler: Modeler | undefined) {
  return modelerStore().setModeler(modeler)
}

export function setElement(element: Element | undefined) {
  return modelerStore().setElement(element)
}

export function getElRegistry(): ElementRegistry | undefined {
  return modelerStore().getElRegistry
}

export const getActive = (): Element | undefined => modelerStore().getActive
export const getActiveId = (): string | undefined => modelerStore().getActiveId
