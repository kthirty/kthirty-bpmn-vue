import { defineComponent, ref, watch, type PropType } from 'vue'
import { Button, Drawer, Form, FormItem, Input, Table, type TableColumnType } from 'ant-design-vue'
import type { Key } from 'ant-design-vue/es/table/interface'
import { Settings } from 'lucide-vue-next'
import type { DataSourceExtraParam, DataSourceItem } from '../types'
import { format } from 'packages/utils/BpmnElementHelper'

export default defineComponent({
  name: 'SelectableDrawer',
  props: {
    dataSource: {
      type: Function as PropType<() => DataSourceItem[]>,
      required: false
    },
    value: {
      type: String,
      required: false,
      default: ''
    }
  },
  emits: ['update:value', 'select'],
  setup(props, { emit, slots }) {
    const dataSource = ref(props.dataSource?.())
    const drawerVisible = ref(false)
    const openDrawer = () => {
      dataSource.value = props.dataSource?.()
      drawerVisible.value = true
    }
    const closeDrawer = () => (drawerVisible.value = false)
    const handleSelectChange = (selectedRowKeys: Key[], selectRows: any[]) => {
      const selectRow = selectRows[0] as DataSourceItem
      if (selectRow.extraParam && selectRow.extraParam?.length > 0) {
        extra.value.model = {}
        extra.value.columns = selectRow.extraParam
        selectRow.extraParam.forEach((it) => it.defaultValue && (extra.value.model[it.value] = it.defaultValue))
        extra.value.row = selectRow
        extra.value.visible = true
      } else {
        emit('update:value', selectedRowKeys[0])
        emit('select', selectedRowKeys[0], selectRows[0])
        closeDrawer()
      }
    }

    const columns: TableColumnType[] = [
      { title: '名称', dataIndex: 'label', key: 'label', width: 100 },
      { title: '值', dataIndex: 'value', key: 'value', width: 100 },
      { title: '描述', dataIndex: 'description', key: 'description', width: 100 }
    ]
    const extraFormRef = ref()
    const extra = ref<{ visible: boolean; model: any; columns: DataSourceExtraParam[]; row?: DataSourceItem }>({
      row: undefined,
      visible: false,
      model: {},
      columns: []
    })
    const extraClose = () => extra.value.visible = false
    const extraSave =  () => {
      extraFormRef.value.validate()
      .then(() => {
        const currentKey = format(extra.value.row!.value, extra.value.model)
         emit('update:value', currentKey)
         emit('select', currentKey, extra.value.row)
         extraClose()
         closeDrawer()
      }).catch(() => {})

    }
    return () => (
      <>
        <div onClick={openDrawer}>{slots.default ? slots.default() : <Settings style="cursor: pointer;" size={18} />}</div>
        <Drawer width="40%" visible={drawerVisible.value} onClose={closeDrawer} destroyOnClose={true} title="请选择">
          <Table
            customRow={(record) => {
              return { onClick: () => handleSelectChange([record['value']], [record]) }
            }}
            columns={columns}
            dataSource={dataSource.value}
            rowKey="value"
            pagination={false}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: [props.value || ''],
              onChange: handleSelectChange
            }}
          />
        </Drawer>
        <Drawer
          visible={extra.value.visible}
          title="请补充信息"
          size="large"
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
