import Modeler from "bpmn-js/lib/Modeler";

export const EmptyXml = (key?: string, name?: string): string => {
    const timestamp = Date.now()
    key = key || `Process_${timestamp}`;
    name = name || `业务流程_${timestamp}`;
    return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  targetNamespace="http://bpmn.io/schema/bpmn"
  id="Definitions_${key}">
  <bpmn:process id="${key}" name="${name}" isExecutable="true"></bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${key}"></bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`
}

export const createNewDiagram = async function (modeler: Modeler,newXml?: string, settings?: any) {
    try {
        const timestamp = Date.now()
        const { processId, processName } = settings || {}
        const newId: string = processId ? processId : `Process_${timestamp}`
        const newName: string = processName || `业务流程_${timestamp}`
        const xmlString = newXml || EmptyXml(newId, newName)
        const { warnings } = await modeler!.importXML(xmlString)
        if (warnings && warnings.length) {
            warnings.forEach((warn) => console.warn(warn))
        }
    } catch (e) {
        console.error(`[Process Designer Warn]: ${typeof e === 'string' ? e : (e as Error)?.message}`)
    }
}

