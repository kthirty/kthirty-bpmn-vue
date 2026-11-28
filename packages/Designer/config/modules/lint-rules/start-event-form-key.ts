import { exProp } from './lint-helpers'

const startEventFormKey = () => ({
  check(node: any, reporter: any) {
    if (node.$type !== 'bpmn:StartEvent') return
    if (exProp(node, 'formKey') === '') {
      reporter.report(node.id, '开始节点须配置表单代码 formKey（其他节点未配置时将沿用该值）')
    }
  }
})

export default startEventFormKey
