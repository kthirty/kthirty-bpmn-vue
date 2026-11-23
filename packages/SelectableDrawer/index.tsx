import { defineComponent, ref, type PropType } from 'vue'
import { Button, Drawer, Form, FormItem, Icon, Input, Table } from '../ui'
import type { DataSourceExtraParam, DataSourceItem } from '../types'
import { format } from '../utils/BpmnElementHelper'
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

    const columns = [
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

    const extra = ref<{ visible: boolean; model: any; columns: DataSourceExtraParam[]; row?: DataSourceItem }>({
      row: undefined,
      visible: false,
      model: {},
      columns: []
    })
    const extraClose = () => (extra.value.visible = false)
    const extraOpen = () => (extra.value.visible = true)
    const formRef = ref<{ validate: () => boolean } | null>(null)
    const extraSave = () => {
      if (!formRef.value?.validate()) return
      emit('select', format({ ...extra.value.row?.value }, extra.value.model))
      extraClose()
      closeDrawer()
    }
    return () => (
      <>
        <div onClick={openDrawer}>{slots.default ? slots.default() : <Icon name="settings" />}</div>
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
          <Form ref={formRef} colon={false} labelCol={{ span: 6 }} model={extra.value.model} validateTrigger="blur">
            {extra.value.columns.map((item) => (
              <FormItem label={item.label} name={item.value} tooltip={item.description} required={item.required}>
                <Input v-model:value={extra.value.model[item.value]} />
              </FormItem>
            ))}
          </Form>
        </Drawer>
      </>
    )
  }
})
