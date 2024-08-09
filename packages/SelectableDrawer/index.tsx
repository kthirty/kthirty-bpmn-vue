import { defineComponent, ref, watch } from 'vue'
import { Drawer, Table, type TableColumnType } from 'ant-design-vue'
import type { Key } from 'ant-design-vue/es/table/interface'
import { Settings } from 'lucide-vue-next'

interface DataSourceItem {
  key: string
  label: string
  [key: string]: any
}

export default defineComponent({
  name: 'SelectableDrawer',
  props: {
    dataSource: {
      type: Array as () => DataSourceItem[],
      required: false
    },
    value: {
      type: String,
      required: true,
      default: ''
    }
  },
  emits: ['update:value'],
  setup(props, { emit, slots }) {
    const drawerVisible = ref(false)
    const openDrawer = () => (drawerVisible.value = true)
    const closeDrawer = () => (drawerVisible.value = false)
    const handleSelectChange = (selectedRowKeys: Key[]) => {
      emit('update:value', selectedRowKeys[0])
      closeDrawer()
    }

    const columns: TableColumnType[] = [
      { title: '名称', dataIndex: 'label', key: 'label' },
      { title: '值', dataIndex: 'value', key: 'value' },
      { title: '描述', dataIndex: 'description', key: 'description' }
    ]

    return () => (
      <>
        <div onClick={openDrawer}>
          {slots.default ? slots.default() : <Settings style="cursor: pointer;" size={18} />}
        </div>
        <Drawer width="40%" visible={drawerVisible.value} onClose={closeDrawer} title="请选择">
          <Table
            customRow={(record) => {
              return { onClick: () => handleSelectChange([record['value']]) }
            }}
            columns={columns}
            dataSource={props.dataSource}
            rowKey="value"
            pagination={false}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: [props.value || ''],
              onChange: handleSelectChange
            }}
          />
        </Drawer>
      </>
    )
  }
})
