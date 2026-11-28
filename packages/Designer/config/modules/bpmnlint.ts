/**
 * 源代码地址：https://codesandbox.io/s/5nj1t?file=/src/index.js
 * @author felix.mueller
 */

import rule_0 from 'bpmnlint/rules/conditional-flows'
import rule_1 from 'bpmnlint/rules/end-event-required'
import rule_2 from 'bpmnlint/rules/event-sub-process-typed-start-event'
import rule_3 from 'bpmnlint/rules/fake-join'
import rule_4 from 'bpmnlint/rules/label-required'
import rule_5 from 'bpmnlint/rules/no-bpmndi'
import rule_6 from 'bpmnlint/rules/no-complex-gateway'
import rule_7 from 'bpmnlint/rules/no-disconnected'
import rule_8 from 'bpmnlint/rules/no-duplicate-sequence-flows'
import rule_9 from 'bpmnlint/rules/no-gateway-join-fork'
import rule_10 from 'bpmnlint/rules/no-implicit-split'
import rule_11 from 'bpmnlint/rules/no-inclusive-gateway'
import rule_12 from 'bpmnlint/rules/single-blank-start-event'
import rule_13 from 'bpmnlint/rules/single-event-definition'
import rule_14 from 'bpmnlint/rules/start-event-required'
import rule_15 from 'bpmnlint/rules/sub-process-blank-start-event'
import rule_16 from 'bpmnlint/rules/superfluous-gateway'
import rule_17 from './lint-rules/user-task-assignee'
import rule_18 from './lint-rules/user-task-buttons'
import rule_19 from './lint-rules/start-event-form-key'
import rule_20 from './lint-rules/service-like-implementation'
import rule_21 from './lint-rules/script-task-script'
import rule_22 from './lint-rules/call-activity-called-element'
import rule_23 from './lint-rules/process-executable'
import rule_24 from './lint-rules/start-event-initiator'
import rule_25 from './lint-rules/multi-instance-config'
import rule_26 from './lint-rules/user-task-outgoing-condition'
import { wrapLintRule } from './lint-rules/wrap-lint-rule'

const cache: Record<string, any> = {}

function registerRule(key: string, factory: any) {
  cache[key] = wrapLintRule(factory)
}

class Resolver {
  resolveRule(pkg: string, ruleName: string) {
    const rule = cache[pkg + '/' + ruleName]
    if (!rule) {
      throw new Error('cannot resolve rule <' + pkg + '/' + ruleName + '>')
    }
    return rule
  }

  resolveConfig(pkg: string, configName: string) {
    throw new Error('cannot resolve config <' + configName + '> in <' + pkg + '>')
  }
}

const resolver = new Resolver()

const rules = {
  'conditional-flows': 'error',
  'end-event-required': 'error',
  'event-sub-process-typed-start-event': 'error',
  'fake-join': 'off',
  'label-required': 'off',
  'no-bpmndi': 'error',
  'no-complex-gateway': 'error',
  'no-disconnected': 'warning',
  'no-duplicate-sequence-flows': 'error',
  'no-gateway-join-fork': 'error',
  'no-implicit-split': 'error',
  'no-inclusive-gateway': 'error',
  'single-blank-start-event': 'error',
  'single-event-definition': 'error',
  'start-event-required': 'error',
  'sub-process-blank-start-event': 'error',
  'superfluous-gateway': 'warning',
  'user-task-assignee': 'error',
  'user-task-buttons': 'error',
  'start-event-form-key': 'error',
  'service-like-implementation': 'error',
  'script-task-script': 'error',
  'call-activity-called-element': 'error',
  'process-executable': 'error',
  'start-event-initiator': 'warning',
  'multi-instance-config': 'error',
  'user-task-outgoing-condition': 'warning'
}

const config = {
  rules: rules
}

const bundle = {
  resolver: resolver,
  config: config
}
;[
  ['bpmnlint/conditional-flows', rule_0],
  ['bpmnlint/end-event-required', rule_1],
  ['bpmnlint/event-sub-process-typed-start-event', rule_2],
  ['bpmnlint/fake-join', rule_3],
  ['bpmnlint/label-required', rule_4],
  ['bpmnlint/no-bpmndi', rule_5],
  ['bpmnlint/no-complex-gateway', rule_6],
  ['bpmnlint/no-disconnected', rule_7],
  ['bpmnlint/no-duplicate-sequence-flows', rule_8],
  ['bpmnlint/no-gateway-join-fork', rule_9],
  ['bpmnlint/no-implicit-split', rule_10],
  ['bpmnlint/no-inclusive-gateway', rule_11],
  ['bpmnlint/single-blank-start-event', rule_12],
  ['bpmnlint/single-event-definition', rule_13],
  ['bpmnlint/start-event-required', rule_14],
  ['bpmnlint/sub-process-blank-start-event', rule_15],
  ['bpmnlint/superfluous-gateway', rule_16],
  ['bpmnlint/user-task-assignee', rule_17],
  ['bpmnlint/user-task-buttons', rule_18],
  ['bpmnlint/start-event-form-key', rule_19],
  ['bpmnlint/service-like-implementation', rule_20],
  ['bpmnlint/script-task-script', rule_21],
  ['bpmnlint/call-activity-called-element', rule_22],
  ['bpmnlint/process-executable', rule_23],
  ['bpmnlint/start-event-initiator', rule_24],
  ['bpmnlint/multi-instance-config', rule_25],
  ['bpmnlint/user-task-outgoing-condition', rule_26]
].forEach(([key, factory]) => registerRule(key, factory))

export default bundle

export { config, resolver }
