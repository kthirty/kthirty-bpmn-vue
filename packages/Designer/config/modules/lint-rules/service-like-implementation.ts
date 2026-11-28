import { hasServiceImplementation } from './lint-helpers'

const SERVICE_LIKE = new Set(['bpmn:ServiceTask', 'bpmn:SendTask', 'bpmn:BusinessRuleTask'])

const serviceLikeImplementation = () => ({
  check(node: any, reporter: any) {
    if (!SERVICE_LIKE.has(node.$type)) return
    if (!hasServiceImplementation(node)) {
      reporter.report(node.id, '服务类节点须配置 Java 类、表达式或代理表达式之一')
    }
  }
})

export default serviceLikeImplementation
