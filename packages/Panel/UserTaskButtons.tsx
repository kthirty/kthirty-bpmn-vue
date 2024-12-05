import { defineComponent, onMounted, type PropType, ref, watch } from 'vue'
import {
  Button,
  CollapsePanel,
  ConfigProvider,
  Drawer,
  Form,
  type FormInstance,
  FormItem,
  Input,
  Popconfirm,
  Space,
  Switch,
  Table,
  type TableColumnType,
  Textarea
} from 'ant-design-vue'
import type { Element } from 'bpmn-js/lib/model/Types'
import type { ButtonInfo, PanelOption } from '../types'
import { isUserTask } from '../utils/BpmnElementType'
import type { Key } from 'ant-design-vue/es/table/interface'
import { message } from '../utils/BpmnElementHelper'
import { UserTask } from '../utils/BpmnElementProp'

export default defineComponent({
  name: 'UserTaskButtons',
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
    const buttons = ref<ButtonInfo[]>([])
    const visible = ref<boolean>(false)
    // 加载属性
    const loadProps = () => {
      visible.value = isUserTask(props.element)
      if (!visible.value) return
      buttons.value = UserTask.getButtons(props.element)
    }
    onMounted(loadProps)
    watch(() => props.element, loadProps)
    // 变更属性
    const updateProps = () => {
      UserTask.removeButtons(props.element)
      UserTask.addButton(props.element, buttons.value)
    }
    // 列表选择
    const formRef = ref<FormInstance | null>(null)
    const currentIsEdit = ref<boolean>(false)
    const currentSelect = ref<ButtonInfo[]>([])
    const currentSelectKeys = ref<Key[]>([])
    const rowSelected = (keys: Key[], rows: any[]) => {
      currentSelectKeys.value = keys
      currentSelect.value = rows
    }
    // 列表字段
    const columns: TableColumnType[] = [
      { title: 'Code', dataIndex: 'code', key: 'code', align: 'center', ellipsis: true },
      { title: 'Name', dataIndex: 'name', key: 'name', align: 'center', ellipsis: true },
      { title: 'ResultCode', dataIndex: 'resultCode', key: 'resultCode', align: 'center', ellipsis: true },
      { title: 'CommentRequired', dataIndex: 'commentRequired', key: 'commentRequired', align: 'center', ellipsis: true }
    ]
    // 列表数据修改
    const del = () => {
      buttons.value = buttons.value.filter((it) => !currentSelect.value.includes(it))
      updateProps()
    }
    const toEdit = () => {
      if (currentSelect.value.length !== 1) {
        return message('error', '请选择一条数据进行修改')
      }
      currentIsEdit.value = true
      editForm.value = { ...currentSelect.value[0] }
      openDrawer()
    }
    const save = () => {
      formRef.value?.validate().then(() => {
        if (currentIsEdit.value) {
          const index = buttons.value.indexOf(currentSelect.value[0])
          buttons.value[index] = { ...editForm.value }
        } else {
          buttons.value.push({ ...editForm.value })
        }
        updateProps()
        closeDrawer()
      })
    }
    // 数据变更Form
    const drawerShow = ref<boolean>(false)
    const openDrawer = () => {
      editForm.value = {}
      currentIsEdit.value = false
      drawerShow.value = true
    }
    const fastAdd = (type: string) => {
      if (type === 'pass') {
        buttons.value.push({
          code: 'PASS',
          name: '通过',
          resultCode: 'PASS',
          description: '',
          commentRequired: false
        })
      }
      if (type === 'reject') {
        buttons.value.push({
          code: 'REJECT',
          name: '驳回',
          resultCode: 'REJECT',
          description: '',
          commentRequired: true
        })
      }
    }

    const closeDrawer = () => {
      drawerShow.value = false
    }
    const editForm = ref<ButtonInfo>({})

    return () =>
      visible.value ? (
        <CollapsePanel
          key="UserTaskButtons"
          v-slots={{
            header: () => '按钮配置',
            default: () => (
              <ConfigProvider componentSize="middle">
                <Space>
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
                <Space>
                  <Button type="default" size="small" onClick={() => fastAdd('pass')}>
                    通过按钮
                  </Button>
                  <Button type="default" size="small" onClick={() => fastAdd('reject')}>
                    驳回按钮
                  </Button>
                </Space>

                <Table
                  rowSelection={{ type: 'checkbox', onChange: rowSelected, selectedRowKeys: currentSelectKeys.value }}
                  rowKey={(re: any) => JSON.stringify(re)}
                  pagination={false}
                  bordered
                  columns={columns}
                  dataSource={buttons.value}
                />
                <Drawer
                  onClose={() => {
                    editForm.value = {}
                    currentIsEdit.value = false
                  }}
                  width="30%"
                  v-model:open={drawerShow.value}
                  title="按钮编辑"
                  v-slots={{
                    extra: () => (
                      <Button type="primary" onClick={save}>
                        保存
                      </Button>
                    )
                  }}
                >
                  <Form model={editForm.value} validateTrigger="blur" ref={formRef}>
                    <FormItem name="code" label="Code" required tooltip="按钮唯一标识，无其他作用">
                      <Input v-model:value={editForm.value.code} />
                    </FormItem>
                    <FormItem name="name" label="Name" required tooltip="按钮名称">
                      <Input v-model:value={editForm.value.name} />
                    </FormItem>
                    <FormItem name="resultCode" label="ResultCode" required tooltip="任务提交时，任务的传输结果值">
                      <Input v-model:value={editForm.value.resultCode} />
                    </FormItem>
                    <FormItem name="description" label="Description" tooltip="任务按钮的描述">
                      <Textarea v-model:value={editForm.value.description} />
                    </FormItem>
                    <FormItem name="commentRequired" label="CommentRequired" tooltip="点击此按钮时是否必须填写意见">
                      <Switch v-model:checked={editForm.value.commentRequired} />
                    </FormItem>
                  </Form>
                </Drawer>
              </ConfigProvider>
            )
          }}
        />
      ) : (
        <div style="display: none" />
      )
  }
})
