// 条件类型
const defaultConditionTypeOptions: Record<string, string>[] = [
  { label: '无条件( None )', value: 'none' },
  { label: '默认路径( Default )', value: 'default' },
  { label: '条件表达式( Expression )', value: 'expression' },
  { label: '条件脚本( Script )', value: 'script' }
]
export const scriptTypeOptions: Record<string, string>[] = [
  { label: '外链脚本( External Resource )', value: 'external' },
  { label: '内联脚本( Inline Script )', value: 'inline' },
  { label: '无( None )', value: 'none' }
]

export const listenerValueTypeOptions: { label: string; value: string }[] = [
  { label: '类', value: 'class' },
  { label: '表达式', value: 'expression' },
  { label: '代理表达式', value: 'delegateExpression' }
]
// 执行监听器事件类型
export const executionEventOptions: Record<string, string>[] = [
  { label: '开始', value: 'start' },
  { label: '启用', value: 'take' },
  { label: '结束', value: 'end' }
]
export const taskEventOptions: Record<string, string>[] = [
  { label: '创建', value: 'create' },
  { label: '指派', value: 'assignment' },
  { label: '完成', value: 'complete' },
  { label: '删除', value: 'delete' },
  { label: '所有事件', value: 'all' }
]
// 事件监听器
export const eventEventOptions: Record<string, string>[] = [
  { label: '活动取消', value: 'ACTIVITY_CANCELLED' },
  { label: '活动补偿', value: 'ACTIVITY_COMPENSATE' },
  { label: '活动完成', value: 'ACTIVITY_COMPLETED' },
  { label: '活动错误接收', value: 'ACTIVITY_ERROR_RECEIVED' },
  { label: '活动消息取消', value: 'ACTIVITY_MESSAGE_CANCELLED' },
  { label: '活动消息接收', value: 'ACTIVITY_MESSAGE_RECEIVED' },
  { label: '活动消息等待', value: 'ACTIVITY_MESSAGE_WAITING' },
  { label: '活动发信号', value: 'ACTIVITY_SIGNALED' },
  { label: '活动信号等待', value: 'ACTIVITY_SIGNAL_WAITING' },
  { label: '活动开始', value: 'ACTIVITY_STARTED' },
  { label: '自定义', value: 'CUSTOM' },
  { label: '引擎关闭', value: 'ENGINE_CLOSED' },
  { label: '引擎创建', value: 'ENGINE_CREATED' },
  { label: '实体激活', value: 'ENTITY_ACTIVATED' },
  { label: '实体创建', value: 'ENTITY_CREATED' },
  { label: '实体删除', value: 'ENTITY_DELETED' },
  { label: '实体初始化', value: 'ENTITY_INITIALIZED' },
  { label: '实体挂起', value: 'ENTITY_SUSPENDED' },
  { label: '实体更新', value: 'ENTITY_UPDATED' },
  { label: '历史活动实例创建', value: 'HISTORIC_ACTIVITY_INSTANCE_CREATED' },
  { label: '历史活动实例结束', value: 'HISTORIC_ACTIVITY_INSTANCE_ENDED' },
  { label: '历史流程实例创建', value: 'HISTORIC_PROCESS_INSTANCE_CREATED' },
  { label: '历史流程实例结束', value: 'HISTORIC_PROCESS_INSTANCE_ENDED' },
  { label: '任务取消', value: 'JOB_CANCELED' },
  { label: '任务执行失败', value: 'JOB_EXECUTION_FAILURE' },
  { label: '任务执行成功', value: 'JOB_EXECUTION_SUCCESS' },
  { label: '任务重新调度', value: 'JOB_RESCHEDULED' },
  { label: '任务重试次数递减', value: 'JOB_RETRIES_DECREMENTED' },
  { label: 'membership创建', value: 'MEMBERSHIP_CREATED' },
  { label: 'membership删除', value: 'MEMBERSHIP_DELETED' },
  { label: 'memberships删除', value: 'MEMBERSHIPS_DELETED' },
  { label: '多实例活动取消', value: 'MULTI_INSTANCE_ACTIVITY_CANCELLED' },
  { label: '多实例活动完成', value: 'MULTI_INSTANCE_ACTIVITY_COMPLETED' },
  { label: '多实例活动条件完成', value: 'MULTI_INSTANCE_ACTIVITY_COMPLETED_WITH_CONDITION' },
  { label: '多实例活动开始', value: 'MULTI_INSTANCE_ACTIVITY_STARTED' },
  { label: '流程取消', value: 'PROCESS_CANCELLED' },
  { label: '流程完成', value: 'PROCESS_COMPLETED' },
  { label: '流程终止完成', value: 'PROCESS_COMPLETED_WITH_TERMINATE_END_EVENT' },
  { label: '流程错误结束完成', value: 'PROCESS_COMPLETED_WITH_ERROR_END_EVENT' },
  { label: '流程创建', value: 'PROCESS_CREATED' },
  { label: '流程开始', value: 'PROCESS_STARTED' },
  { label: '序列流通过', value: 'SEQUENCEFLOW_TAKEN' },
  { label: '任务分配', value: 'TASK_ASSIGNED' },
  { label: '任务完成', value: 'TASK_COMPLETED' },
  { label: '任务创建', value: 'TASK_CREATED' },
  { label: '计时器触发', value: 'TIMER_FIRED' },
  { label: '计时器安排', value: 'TIMER_SCHEDULED' },
  { label: '未捕获的BPMN错误', value: 'UNCAUGHT_BPMN_ERROR' },
  { label: '变量创建', value: 'VARIABLE_CREATED' },
  { label: '变量删除', value: 'VARIABLE_DELETED' },
  { label: '变量更新', value: 'VARIABLE_UPDATED' }
]
