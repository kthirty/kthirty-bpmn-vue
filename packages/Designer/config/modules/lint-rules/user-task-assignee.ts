import { getProcessEngine } from '../../../../utils/BpmnHolder'

function getExPropValue<T>(element: any, propKey: string): T {
  const exPropKey = `${getProcessEngine()}:${propKey}`
  return element && element.get ? element.get(exPropKey) : element ? element[exPropKey] : element
}

const userTaskAssignee = () => {
  return {
    check(node, reporter: any) {
      if (node.$type === 'bpmn:UserTask') {
        const hasAssignee = (getExPropValue<string>(node, 'assignee') || '')?.trim() !== ''
        const hasCandidateUsers = (getExPropValue<string>(node, 'candidateUsers') || '')?.trim() !== ''
        const hasCandidateGroups = (getExPropValue<string>(node, 'candidateGroups') || '')?.trim() !== ''

        if (!hasAssignee && !hasCandidateUsers && !hasCandidateGroups) {
          reporter.report(node.id, 'User task should have an assignee, candidate users, or candidate groups.')
        }
      }
    }
  }
}

export default userTaskAssignee
