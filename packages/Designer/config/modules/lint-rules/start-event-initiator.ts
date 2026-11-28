import { exProp, isDirectChildOfProcess } from './lint-helpers'

const startEventInitiator = () => ({
  check(node: any, reporter: any) {
    if (node.$type !== 'bpmn:StartEvent') return
    if (!isDirectChildOfProcess(node)) return
    if (exProp(node, 'initiator') === '') {
      reporter.report(node.id, '主流程开始节点建议配置 initiator（如 starter），以便使用 ${starter} 等表达式')
    }
  }
})

export default startEventInitiator
