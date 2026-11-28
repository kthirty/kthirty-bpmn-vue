import { conditionBody } from './lint-helpers'

const userTaskOutgoingCondition = () => ({
  check(node: any, reporter: any) {
    if (node.$type !== 'bpmn:UserTask') return
    const outgoing = node.outgoing || []
    if (outgoing.length < 2) return
    const missing = outgoing.filter((flow: any) => conditionBody(flow) === '')
    if (missing.length > 0) {
      reporter.report(node.id, "用户任务存在多条出线时，建议每条顺序流配置条件表达式（如 ${_result=='PASS'}）")
    }
  }
})

export default userTaskOutgoingCondition
