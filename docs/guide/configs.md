# 配置说明

## BpmnDesigner 

| 配置字段   | 配置说明    | 是否必填 | 配置类型                                      |
|--------|---------|------|-------------------------------------------|
| xml    | 流程定义XML | Y    | string                                    |
| option | 自定义配置项  | N    | [BpmnDesignerOption](#BpmnDesignerOption) |

## BpmnDesignerOption

| 配置字段     | 配置说明   | 是否必填 | 配置类型                              |
|----------|--------|------|-----------------------------------|
| designer | 设计器配置  | N    | [DesignerOption](#DesignerOption) |
| panel    | 属性面板配置 | N    | [PanelOption](#PanelOption)       |
| toolbar  | 工具栏配置  | N    | [ToolbarOption](#ToolbarOption)   |

### DesignerOption

| 配置字段          | 配置说明               | 是否必填 | 配置类型                                             |
|---------------|--------------------|------|--------------------------------------------------|
| processEngine | 流程引擎               | N    | flowable / activiti                              |
| configEnhance | bpmn-js 原生config拓展 | N    | (config: BaseViewerOptions) => BaseViewerOptions |

### PanelOption

| 配置字段           | 配置说明     | 是否必填 | 配置类型                                                                           |
|----------------|----------|------|--------------------------------------------------------------------------------|
| items          | 启用功能     | N    | BasicInfo , Condition , Listener , StartInitiator , UserTask , UserTaskButtons |
| extra          | 额外拓展     | N    | JSX.Element                                                                    |
| UserTask       | 用户节点相关配置 | N    | [UserTask](#UserTask)                                                          |
| StartInitiator | 启动器相关配置  | N    | [StartInitiator](#StartInitiator)                                              |
| Listener       | 监听器相关配置  | N    | [Listener](#Listener)                                                          |

#### UserTask

| 配置字段                     | 配置说明      | 是否必填 | 配置类型                                                  |
|--------------------------|-----------|------|-------------------------------------------------------|
| assigneeDataSource       | 任务人预设选项   | N    | (type: string) => [DataSourceItem](#DataSourceItem)[] |
| dueDateDataSource        | 过期日预设选项   | N    | () => [DataSourceItem](#DataSourceItem)[]             |
| skipExpressionDataSource | 跳过表达式预设选项 | N    | () => [DataSourceItem](#DataSourceItem)[]             |
| formKeyDateDataSource    | 表单预设选项    | N    | () => [DataSourceItem](#DataSourceItem)[]             |

#### StartInitiator

| 配置字段                  | 配置说明   | 是否必填 | 配置类型                                      |
|-----------------------|--------|------|-------------------------------------------|
| formKeyDateDataSource | 表单预设选项 | N    | () => [DataSourceItem](#DataSourceItem)[] |

#### Listener

| 配置字段       | 配置说明  | 是否必填 | 配置类型                                                                         |
|------------|-------|------|------------------------------------------------------------------------------|
| dataSource | 预设监听器 | N    | (type: [ListenerType](#ListenerType)) => [DataSourceItem](#DataSourceItem)[] |

### ToolbarOption

| 配置字段  | 配置说明 | 是否必填 | 配置类型                                                                                     |
|-------|------|------|------------------------------------------------------------------------------------------|
| items | 启用工具 | N    | 使用的工具（'Imports', 'Exports', 'Previews', 'LintToggle', 'Aligns', 'Scales' , 'Commands'） ) |
| extra | 额外拓展 | N    | JSX.Element                                                                              |

## Other

### DataSourceItem

```ts
export interface DataSourceItem {
  value: any
  label: string
  description?: string
  // 需要补充的参数
  extraParam?: DataSourceExtraParam[]
}

// 补充参数
export interface DataSourceExtraParam {
  value: string
  label: string
  description: string
  required?: boolean
  defaultValue?: string
}
```

### ListenerType

```ts
export type ListenerType = 'TaskListener' | 'ExecutionListener' | 'EventListener'
```
