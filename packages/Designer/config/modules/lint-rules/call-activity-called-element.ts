import { exProp, stdProp } from './lint-helpers'

const callActivityCalledElement = () => ({
  check(node: any, reporter: any) {
    if (node.$type !== 'bpmn:CallActivity') return
    if (stdProp(node, 'calledElement') === '') {
      reporter.report(node.id, '调用活动须配置被调用流程 calledElement')
      return
    }
    const binding = exProp(node, 'calledElementBinding') || 'latest'
    if (binding === 'version' && exProp(node, 'calledElementVersion') === '') {
      reporter.report(node.id, '调用活动绑定方式为指定版本时须填写版本号')
    }
    if (binding === 'versionTag' && exProp(node, 'calledElementVersionTag') === '') {
      reporter.report(node.id, '调用活动绑定方式为版本标签时须填写版本标签')
    }
  }
})

export default callActivityCalledElement
