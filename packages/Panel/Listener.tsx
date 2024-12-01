import { defineComponent, onMounted, reactive, ref, watch, type PropType } from 'vue'
import type { Element } from 'bpmn-js/lib/model/Types'
import {
  Button,
  CollapsePanel,
  ConfigProvider,
  Divider,
  Drawer,
  Form,
  FormItem,
  Input,
  Popconfirm,
  RadioGroup,
  Select,
  Space,
  Table,
  TabPane,
  Tabs,
  type TableColumnType
} from 'ant-design-vue'
import { isProcess, isUserTask } from '../utils/BpmnElementType'
import { Listener } from '../utils/BpmnElementProp'
import type { DataSourceItem, ListenerConfig, ListenerFieldConfig, ListenerType, PanelOption } from '../types'
import type { DefaultOptionType } from 'ant-design-vue/es/select'
import { eventEventOptions, executionEventOptions, fieldTypeOptions, listenerValueTypeOptions, taskEventOptions } from '../utils/BpmnElementData'
import type { Key } from 'ant-design-vue/es/table/interface'
import { format, message } from '../utils/BpmnElementHelper'
import SelectableDrawer from '../SelectableDrawer'

export default defineComponent({
  name: 'Listener',
  props: {
    element: {
      type: Object as PropType<Element>,
      required: true
    },
    option: {
      type: Object as PropType<PanelOption>,
      required: false
    }
  },
  setup(props) {
    const columns: TableColumnType[] = [
      {
        title: '事件',
        dataIndex: 'event',
        ellipsis: true,
        key: 'event',
        align: 'center',
        customRender: ({ text }) => eventOptions.value.filter((it) => it.value === text)?.[0]?.label
      },
      {
        title: '类型',
        dataIndex: 'type',
        ellipsis: true,
        key: 'type',
        align: 'center',
        customRender: ({ text }) => listenerValueTypeOptions.filter((it) => it.value === text)?.[0].label
      },
      { title: '监听器', dataIndex: 'value', key: 'value', align: 'center', ellipsis: true }
    ]
    const fieldColumns: TableColumnType[] = [
      { title: '字段名', dataIndex: 'name', key: 'name', align: 'center' },
      { title: '字段类型', dataIndex: 'type', key: 'type', align: 'center', customRender: ({ text }) => fieldTypeOptions.filter((it) => it.value === text)?.[0].label },
      { title: '字段值', dataIndex: 'value', key: 'value', align: 'center' }
    ]

    const activeTab = ref<ListenerType>('ExecutionListener')
    const taskList = ref<ListenerConfig[]>([])
    const eventList = ref<ListenerConfig[]>([])
    const executionList = ref<ListenerConfig[]>([])
    const currentSelect = ref<ListenerConfig[]>([])
    const currentSelectKeys = ref<Key[]>([])

    const loadProps = () => {
      if (activeTab.value === 'TaskListener') taskList.value = Listener.getListeners(props.element, 'TaskListener')
      if (activeTab.value === 'EventListener') eventList.value = Listener.getListeners(props.element, 'EventListener')
      if (activeTab.value === 'ExecutionListener') executionList.value = Listener.getListeners(props.element, 'ExecutionListener')
      templateDataSource.value = props.option?.Listener?.dataSource ? props.option?.Listener?.dataSource(activeTab.value) : []
    }
    const updateProps = () => {
      Listener.removeListener(props.element, activeTab.value)
      if (activeTab.value === 'TaskListener') taskList.value.forEach((it) => Listener.addListener(props.element, activeTab.value, it))
      if (activeTab.value === 'EventListener') eventList.value.forEach((it) => Listener.addListener(props.element, activeTab.value, it))
      if (activeTab.value === 'ExecutionListener') executionList.value.forEach((it) => Listener.addListener(props.element, activeTab.value, it))
    }

    onMounted(loadProps)
    watch(
      () => props.element,
      () => {
        activeTab.value = 'ExecutionListener'
        loadProps()
      }
    )

    // 信息编辑
    const drawerShow = ref<boolean>(false)
    const openDrawer = () => (drawerShow.value = true)
    const closeDrawer = () => (drawerShow.value = false)
    const editForm = ref<ListenerConfig>({ type: 'class' })
    const eventOptions = ref<DefaultOptionType[]>([])

    // 事件选项加载
    const loadEventOptions = () => {
      if (activeTab.value === 'ExecutionListener') eventOptions.value = executionEventOptions
      if (activeTab.value === 'EventListener') eventOptions.value = eventEventOptions
      if (activeTab.value === 'TaskListener') eventOptions.value = taskEventOptions
    }
    // 切换tab后加载事件列表，清空选中
    watch(
      () => activeTab.value,
      () => {
        loadEventOptions()
        currentSelectKeys.value = []
      }
    )
    onMounted(loadEventOptions)
    // 表格数据修改
    const del = () => {
      activeTab.value === 'EventListener' && (eventList.value = eventList.value.filter((it) => !currentSelect.value.includes(it)))
      activeTab.value === 'ExecutionListener' && (executionList.value = executionList.value.filter((it) => !currentSelect.value.includes(it)))
      activeTab.value === 'TaskListener' && (taskList.value = taskList.value.filter((it) => !currentSelect.value.includes(it)))
      updateProps()
    }
    const save = () => {
      const currentList = activeTab.value === 'EventListener' ? eventList : activeTab.value === 'ExecutionListener' ? executionList : taskList
      if (currentIsEdit.value) {
        const index = currentList.value.indexOf(currentSelect.value[0])
        currentList.value[index] = { ...editForm.value }
      } else {
        currentList.value.push({ ...editForm.value })
      }
      updateProps()
      closeDrawer()
    }
    const toEdit = () => {
      if (currentSelect.value.length !== 1) {
        return message('error', '请选择一条数据进行修改')
      }
      currentIsEdit.value = true
      let formInfo = { ...currentSelect.value[0] }
      if (activeTab.value === 'EventListener' && typeof currentSelect.value[0].event === 'string') {
        formInfo.event = (currentSelect.value[0].event as string).split(',')
      }
      editForm.value = formInfo
      openDrawer()
    }
    const currentIsEdit = ref<boolean>(false)
    const rowSelected = (keys: Key[], rows: any[]) => {
      currentSelectKeys.value = keys
      currentSelect.value = rows
    }
    // 字段编辑
    const fieldCurrentSelected = ref<{ keys: Key[]; rows: ListenerFieldConfig[] }>({ keys: [], rows: [] })
    const fieldSelected = (keys: Key[], rows: any[]) => {
      fieldCurrentSelected.value.keys = keys
      fieldCurrentSelected.value.rows = rows
    }
    // 字段修改
    const fieldAction = {
      isEdit: ref<boolean>(false),
      show: ref<boolean>(false),
      form: ref<ListenerFieldConfig>({ name: '', type: 'string' }),
      del: () => (editForm.value.field = editForm.value.field?.filter((it) => !fieldCurrentSelected.value.rows.includes(it))),
      toAdd: () => {
        fieldAction.form.value = { name: '', type: 'string'}
        fieldAction.show.value = true
      },
      toEdit: () => {
        fieldAction.form.value = { ...fieldCurrentSelected.value.rows[0] }
        fieldAction.isEdit.value = true
        fieldAction.show.value = true
      },
      save: () => {
        if (!editForm.value.field) {
          editForm.value.field = []
        }
        if (fieldAction.isEdit.value) {
          const index = editForm.value.field.indexOf(fieldCurrentSelected.value.rows[0])
          editForm.value.field[index] = { ...fieldAction.form.value }
        } else {
          editForm.value.field.push({ ...fieldAction.form.value })
        }
        fieldAction.show.value = false
      },
      onClose: () => {
        fieldAction.form.value = { name: '', type: 'string' }
        fieldAction.isEdit.value = false
      }
    }

    const templateDataSource = ref<DataSourceItem[]>([])
    const templateSelect = (selected: any) => {
      const currentList = activeTab.value === 'EventListener' ? eventList : activeTab.value === 'ExecutionListener' ? executionList : taskList
      currentList.value.push({ ...selected })
      // updateProps()
    }
    return () => (
      <CollapsePanel
        key="Listener"
        v-slots={{
          header: () => '监听配置',
          default: () => (
            <ConfigProvider componentSize="middle">
              <Space>
                {templateDataSource.value.length > 0 && (
                  <SelectableDrawer dataSource={() => templateDataSource.value} onSelect={templateSelect}>
                    <Button type="primary">选择预设</Button>
                  </SelectableDrawer>
                )}
                <Button type="primary" onClick={openDrawer}>
                  新增
                </Button>
                <Button type="primary" disabled={currentSelect.value.length !== 1} onClick={toEdit}>
                  编辑
                </Button>
                <Popconfirm title="确认删除？" okText="Yes" cancelText="No" disabled={currentSelect.value.length === 0} onConfirm={del}>
                  <Button type="primary" danger disabled={currentSelect.value.length === 0}>
                    删除
                  </Button>
                </Popconfirm>
              </Space>
              <Tabs v-model:activeKey={activeTab.value}>
                <TabPane key="ExecutionListener" tab="执行监听">
                  <Table
                    rowSelection={{ type: 'checkbox', onChange: rowSelected, selectedRowKeys: currentSelectKeys.value }}
                    rowKey={(re: any) => JSON.stringify(re)}
                    pagination={false}
                    bordered
                    columns={columns}
                    dataSource={executionList.value}
                  />
                </TabPane>
                {isUserTask(props.element) && (
                  <TabPane key="TaskListener" tab="任务监听">
                    <Table
                      rowSelection={{
                        type: 'checkbox',
                        onChange: rowSelected,
                        selectedRowKeys: currentSelectKeys.value
                      }}
                      rowKey={(re: any) => JSON.stringify(re)}
                      pagination={false}
                      bordered
                      columns={columns}
                      dataSource={taskList.value}
                    />
                  </TabPane>
                )}
                {isProcess(props.element) && (
                  <TabPane key="EventListener" tab="事件监听">
                    <Table
                      rowSelection={{ type: 'checkbox', onChange: rowSelected, selectedRowKeys: currentSelectKeys.value }}
                      rowKey={(re: any) => JSON.stringify(re)}
                      pagination={false}
                      bordered
                      columns={columns}
                      dataSource={eventList.value}
                    />
                  </TabPane>
                )}
              </Tabs>
              <Drawer
                onClose={() => {
                  editForm.value = { type: 'class' }
                  currentIsEdit.value = false
                }}
                width="30%"
                v-model:open={drawerShow.value}
                title="监听器编辑"
                v-slots={{
                  extra: () => (
                    <Button type="primary" onClick={save}>
                      保存
                    </Button>
                  )
                }}
              >
                <Form model={editForm.value} validateTrigger="blur">
                  <FormItem name="event" label="事件" required>
                    <Select
                      v-model:value={editForm.value.event}
                      options={eventOptions.value}
                      allowClear
                      showSearch
                      mode={activeTab.value === 'EventListener' ? 'multiple' : undefined}
                    />
                  </FormItem>
                  <FormItem name="type" label="监听类型" required>
                    <RadioGroup v-model:value={editForm.value.type} options={listenerValueTypeOptions} />
                  </FormItem>
                  <FormItem name="value" label="监听值" required>
                    <Input v-model:value={editForm.value.value} />
                  </FormItem>
                  <FormItem>
                    <Divider>注入字段</Divider>
                    <Space style="margin-bottom:10px">
                      <Button type="primary" onClick={fieldAction.toAdd}>
                        新增
                      </Button>
                      <Button type="primary" disabled={fieldCurrentSelected.value.keys.length !== 1} onClick={fieldAction.toEdit}>
                        修改
                      </Button>
                      <Popconfirm title="确认删除？" okText="Yes" cancelText="No" disabled={fieldCurrentSelected.value.keys.length === 0} onConfirm={fieldAction.del}>
                        <Button type="primary" danger disabled={fieldCurrentSelected.value.keys.length === 0}>
                          删除
                        </Button>
                      </Popconfirm>
                    </Space>
                    <Table
                      columns={fieldColumns}
                      rowSelection={{ type: 'checkbox', onChange: fieldSelected }}
                      rowKey={(re) => JSON.stringify(re)}
                      dataSource={editForm.value.field}
                      pagination={false}
                    />
                    <Drawer
                      title="字段编辑"
                      v-model:open={fieldAction.show.value}
                      onClose={fieldAction.onClose}
                      width="30%"
                      v-slots={{
                        extra: () => (
                          <Button type="primary" onClick={fieldAction.save}>
                            保存
                          </Button>
                        )
                      }}
                    >
                      <Form model={fieldAction.form.value}>
                        <FormItem name="name" label="字段名">
                          <Input v-model:value={fieldAction.form.value.name} />
                        </FormItem>
                        <FormItem name="type" label="字段类型">
                          <RadioGroup v-model:value={fieldAction.form.value.type} options={fieldTypeOptions} />
                        </FormItem>
                        <FormItem name="value" label="字段值">
                          <Input v-model:value={fieldAction.form.value.value} />
                        </FormItem>
                      </Form>
                    </Drawer>
                  </FormItem>
                </Form>
              </Drawer>
            </ConfigProvider>
          )
        }}
      />
    )
  }
})
