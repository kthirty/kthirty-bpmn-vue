const processExecutable = () => ({
  check(node: any, reporter: any) {
    if (node.$type !== 'bpmn:Process') return
    const executable = node.isExecutable ?? node.get?.('isExecutable')
    if (executable !== true) {
      reporter.report(node.id, '流程须设置为可执行（isExecutable）')
    }
  }
})

export default processExecutable
