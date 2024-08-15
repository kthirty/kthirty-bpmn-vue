import { defineComponent, markRaw, ref, toRefs, watch, type PropType } from 'vue'
import { Button, Drawer, Form, FormItem, Input, Table, type TableColumnType } from 'ant-design-vue'
import type { Key } from 'ant-design-vue/es/table/interface'
import { Settings } from 'lucide-vue-next'
import type { DataSourceExtraParam, DataSourceItem } from '../types'
import { format } from '../utils/BpmnElementHelper'
import { add } from './../utils/index'

export default defineComponent({
  name: 'SelectableDrawer',
  props: {
    dataSource: {
      type: Function as PropType<() => DataSourceItem[]>,
      required: false
    }
  },
  emits: ['select'],
  setup(props, { emit, slots }) {
    const dataSource = ref(props.dataSource?.())
    const drawerVisible = ref(false)
    const openDrawer = () => {
      dataSource.value = props.dataSource?.()
      drawerVisible.value = true
    }
    const closeDrawer = () => (drawerVisible.value = false)

    const columns: TableColumnType[] = [
      { title: '名称', dataIndex: 'label', key: 'label', width: 100, ellipsis: true, align: 'center' },
      { title: '描述', dataIndex: 'description', key: 'description', width: 100, ellipsis: true, align: 'center' }
    ]
    const selectRow = (row: DataSourceItem) => {
      extra.value.row = row
      if (row.extraParam && row.extraParam.length > 0) {
        extra.value.model = {}
        extra.value.columns = row.extraParam
        extraOpen()
      } else {
        emit('select', extra.value.row.value)
      }
    }

    const extraFormRef = ref()
    const extra = ref<{ visible: boolean; model: any; columns: DataSourceExtraParam[]; row?: DataSourceItem }>({
      row: undefined,
      visible: false,
      model: {},
      columns: []
    })
    const extraClose = () => (extra.value.visible = false)
    const extraOpen = () => (extra.value.visible = true)
    const extraSave = () => {
      extraFormRef.value
        .validate()
        .then(() => {
          emit('select', format({ ...extra.value.row?.value }, extra.value.model))
          extraClose()
          closeDrawer()
        })
        .catch(() => {})
    }
    return () => (
      <>
        <div onClick={openDrawer}>{slots.default ? slots.default() : <Settings style="cursor: pointer;" size={18} />}</div>
        <Drawer visible={drawerVisible.value} onClose={closeDrawer} destroyOnClose={true} title="请选择">
          <Table
            customRow={(record) => {
              return { onClick: () => selectRow(record), style: 'cursor: pointer;' }
            }}
            columns={columns}
            dataSource={dataSource.value}
            rowKey={(it) => JSON.stringify(it)}
            pagination={false}
          />
        </Drawer>
        <Drawer
          visible={extra.value.visible}
          title="请补充信息"
          onClose={extraClose}
          v-slots={{
            extra: () => (
              <Button type="primary" onClick={extraSave}>
                保存
              </Button>
            )
          }}
        >
          <Form ref={extraFormRef} colon={false} labelCol={{ span: 6 }} model={extra.value.model}>
            {extra.value.columns.map((item) => (
              <FormItem label={item.label} name={item.value} tooltip={item.description} rules={item.required ? { required: true, message: `${item.label}不可为空` } : undefined}>
                <Input v-model:value={extra.value.model[item.value]} />
              </FormItem>
            ))}
          </Form>
        </Drawer>
      </>
    )
  }
})
