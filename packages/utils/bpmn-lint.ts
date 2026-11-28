import BpmnModdle from 'bpmn-moddle'
import { Linter } from 'bpmnlint'
import bundle, { config as defaultLintConfig, resolver } from '../Designer/config/modules/bpmnlint'
import flowableModdleDescriptors from '../Designer/config/descriptors/flowable.json'
import activitiModdleDescriptors from '../Designer/config/descriptors/activiti.json'
import { translateLintMessage } from '../Designer/config/modules/languages/lint-messages'
import { getModeler, getProcessEngine, setProcessEngine } from './BpmnHolder'
import type { BpmnLintCategory, BpmnLintIssue, BpmnLintResult, ValidateBpmnOptions } from '../types'

type LintRulesConfig = Record<string, 'off' | 'warn' | 'error' | 'warning' | 'info' | number>

function mergeRules(override?: Partial<LintRulesConfig>): LintRulesConfig {
  return { ...defaultLintConfig.rules, ...override } as LintRulesConfig
}

function buildLintConfig(options?: ValidateBpmnOptions) {
  return { ...defaultLintConfig, rules: mergeRules(options?.rules) }
}

function moddleExtensions(processEngine: string) {
  if (processEngine === 'activiti') return { activiti: activitiModdleDescriptors }
  return { flowable: flowableModdleDescriptors }
}

async function parseDefinitions(xml: string, processEngine: string) {
  const moddle = new BpmnModdle(moddleExtensions(processEngine))
  const { rootElement } = await moddle.fromXML(xml)
  return rootElement
}

function normalizeCategory(category: string): BpmnLintCategory {
  if (category === 'warning') return 'warn'
  if (category === 'warn' || category === 'error' || category === 'info') return category
  return 'error'
}

function flattenReports(reportsByRule: Record<string, any[]>, options?: ValidateBpmnOptions): BpmnLintResult {
  const issues: BpmnLintIssue[] = []
  Object.entries(reportsByRule).forEach(([rule, reports]) => {
    reports.forEach((report) => {
      const category = normalizeCategory(report.category || 'error')
      issues.push({
        rule,
        category,
        elementId: report.id,
        message: translateLintMessage(report.message, options?.messages),
        path: report.path
      })
    })
  })
  const errorCount = issues.filter((i) => i.category === 'error').length
  const warningCount = issues.filter((i) => i.category === 'warn').length
  const failOn = options?.failOn ?? 'error'
  const valid = failOn === 'warn' ? errorCount === 0 && warningCount === 0 : errorCount === 0

  const byRule: Record<string, BpmnLintIssue[]> = {}
  issues.forEach((issue) => {
    byRule[issue.rule] = byRule[issue.rule] || []
    byRule[issue.rule].push(issue)
  })

  return { valid, errorCount, warningCount, issues, byRule }
}

async function lintDefinitions(definitions: any, options?: ValidateBpmnOptions): Promise<BpmnLintResult> {
  const linter = new Linter({ config: bundle.config, resolver })
  const reports = await linter.lint(definitions, buildLintConfig(options))
  return flattenReports(reports, options)
}

async function withEngine<T>(processEngine: string, fn: () => Promise<T>): Promise<T> {
  const prev = getProcessEngine()
  setProcessEngine(processEngine)
  try {
    return await fn()
  } finally {
    setProcessEngine(prev)
  }
}

/** 校验当前设计器中的流程图 */
export async function validateBpmn(options: ValidateBpmnOptions = {}): Promise<BpmnLintResult> {
  const engine = options.processEngine || getProcessEngine() || 'flowable'
  const processEngine: 'flowable' | 'activiti' = engine === 'activiti' ? 'activiti' : 'flowable'
  const modeler = getModeler()
  const xml = options.xml ?? (modeler ? (await modeler.saveXML({ format: true })).xml : undefined)
  if (!xml) {
    return {
      valid: false,
      errorCount: 1,
      warningCount: 0,
      issues: [{ rule: 'internal', category: 'error', message: '未找到可校验的 BPMN（无 modeler 或未传入 xml）' }],
      byRule: {}
    }
  }
  return validateBpmnXml(xml, { ...options, processEngine })
}

/** 根据 XML 离线校验（无需挂载设计器） */
export async function validateBpmnXml(xml: string, options: ValidateBpmnOptions = {}): Promise<BpmnLintResult> {
  const processEngine = options.processEngine || 'flowable'
  return withEngine(processEngine, async () => {
    const definitions = await parseDefinitions(xml, processEngine)
    return lintDefinitions(definitions, options)
  })
}

export async function isBpmnValid(options?: ValidateBpmnOptions): Promise<boolean> {
  return (await validateBpmn(options)).valid
}

export async function refreshCanvasLint(): Promise<void> {
  const linting = getModeler()?.get('linting') as { lint?: () => void } | undefined
  linting?.lint?.()
}
