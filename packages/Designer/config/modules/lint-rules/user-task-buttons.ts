import { extensionsByLocalName } from './lint-helpers'

const userTaskButtons = () => ({
  check(node: any, reporter: any) {
    if (node.$type !== 'bpmn:UserTask') return
    const buttons = extensionsByLocalName(node, 'HandleButton')
    if (buttons.length === 0) {
      reporter.report(node.id, '用户任务须至少配置一个处理按钮')
      return
    }
    buttons.forEach((button, index) => {
      const code = String(button.code ?? button.get?.('code') ?? '').trim()
      const resultCode = String(button.resultCode ?? button.get?.('resultCode') ?? '').trim()
      if (!code || !resultCode) {
        reporter.report(node.id, `用户任务按钮第 ${index + 1} 项须填写 code 与 resultCode`)
      }
    })
  }
})

export default userTaskButtons
