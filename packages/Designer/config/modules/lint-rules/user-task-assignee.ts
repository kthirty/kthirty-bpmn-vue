import { exProp } from './lint-helpers'

const userTaskAssignee = () => ({
  check(node: any, reporter: any) {
    if (node.$type !== 'bpmn:UserTask') return
    const hasAssignee = exProp(node, 'assignee') !== '' || exProp(node, 'candidateUsers') !== '' || exProp(node, 'candidateGroups') !== ''
    if (!hasAssignee) {
      reporter.report(node.id, '用户任务须配置任务人、候选人或候选组')
    }
  }
})

export default userTaskAssignee
