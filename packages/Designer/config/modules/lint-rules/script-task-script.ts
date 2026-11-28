import { stdProp } from './lint-helpers'

const scriptTaskScript = () => ({
  check(node: any, reporter: any) {
    if (node.$type !== 'bpmn:ScriptTask') return
    const resource = stdProp(node, 'resource')
    const script = stdProp(node, 'script')
    const scriptFormat = stdProp(node, 'scriptFormat')
    if (resource !== '' || (script !== '' && scriptFormat !== '')) return
    reporter.report(node.id, '脚本任务须配置外部资源，或同时配置脚本格式与脚本内容')
  }
})

export default scriptTaskScript
