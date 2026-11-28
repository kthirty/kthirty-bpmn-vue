import { enginePrefix, exProp } from './lint-helpers'

const multiInstanceConfig = () => ({
  check(node: any, reporter: any) {
    const loop = node.loopCharacteristics ?? node.get?.('loopCharacteristics')
    if (!loop || loop.$type !== 'bpmn:MultiInstanceLoopCharacteristics') return
    const collectionKey = `${enginePrefix()}:collection`
    const elementVarKey = `${enginePrefix()}:elementVariable`
    const collection = (loop.get?.(collectionKey) ?? loop[collectionKey] ?? '').toString().trim()
    const elementVariable = (loop.get?.(elementVarKey) ?? loop[elementVarKey] ?? '').toString().trim()
    if (!collection) {
      reporter.report(node.id, '多实例已启用时须配置集合 collection')
    }
    if (!elementVariable) {
      reporter.report(node.id, '多实例已启用时须配置元素变量 elementVariable')
    }
  }
})

export default multiInstanceConfig
