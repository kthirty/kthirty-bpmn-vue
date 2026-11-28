import { translateLintMessage } from '../languages/lint-messages'

function wrapReporter(reporter: any, messages?: Record<string, string>) {
  return {
    ...reporter,
    report: (id: string, message: string, path?: any) => reporter.report(id, translateLintMessage(message, messages), path)
  }
}

export function wrapLintRule(ruleFactory: any) {
  return function wrapped(config?: any) {
    const rule = ruleFactory(config)
    const check = rule?.check
    if (!check) return rule

    const enter = check.enter || (typeof check === 'function' ? check : undefined)
    const leave = check.leave

    if (check.enter || check.leave) {
      return {
        check: {
          enter: enter ? (node: any, reporter: any) => enter(node, wrapReporter(reporter)) : undefined,
          leave: leave ? (node: any, reporter: any) => leave(node, wrapReporter(reporter)) : undefined
        }
      }
    }

    return {
      check(node: any, reporter: any) {
        return enter(node, wrapReporter(reporter))
      }
    }
  }
}
