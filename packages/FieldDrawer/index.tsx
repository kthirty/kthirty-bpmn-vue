import {
  Button,
  Divider,
  Drawer,
  Form,
  FormItem,
  Input,
  Popconfirm,
  RadioGroup,
  Space,
  Table,
  type TableColumnType
} from 'ant-design-vue'
import { fieldTypeOptions } from '../utils/BpmnElementData'
import { defineComponent, type PropType, ref, watch } from 'vue'
import type { Key } from 'ant-design-vue/es/table/interface'
import type { Field } from '../types'

export default defineComponent({
  name: 'FieldDrawer',
  props: {
    value: {
      type: Array as () => Field[],
      required: true
    }
  },
  emits: ['change','update:value'],
  setup(props,{ emit }) {

    const fields = ref(props.value)
    watch(fields, (newValue) => {
      emit('update:value', newValue);
      emit('change',newValue)
    });
    const fieldColumns: TableColumnType[] = [
      { title: '字段名', dataIndex: 'name', key: 'name', align: 'center' },
      { title: '字段类型', dataIndex: 'type', key: 'type', align: 'center', customRender: ({ text }) => fieldTypeOptions.filter((it) => it.value === text)?.[0].label },
      { title: '字段值', dataIndex: 'value', key: 'value', align: 'center' }
    ]
    // 字段修改
    const fieldAction = {
      isEdit: ref<boolean>(false),
      show: ref<boolean>(false),
      form: ref<Field>({ name: '', type: 'string' }),
      del: () => (fields.value = fields.value?.filter((it) => !fieldCurrentSelected.value.rows.includes(it))),
      toAdd: () => {
        fieldAction.form.value = { name: '', type: 'string' }
        fieldAction.show.value = true
      },
      toEdit: () => {
        fieldAction.form.value = { ...fieldCurrentSelected.value.rows[0] }
        fieldAction.isEdit.value = true
        fieldAction.show.value = true
      },
      save: () => {
        if (!fields.value || fields.value.length == 0){
          fields.value = []
        }
        if (fieldAction.isEdit.value) {
          const index = fields.value.indexOf(fieldCurrentSelected.value.rows[0])
          fields.value[index] = { ...fieldAction.form.value }
        } else {
          fields.value.push({ ...fieldAction.form.value })
        }
        fieldAction.show.value = false
      },
      onClose: () => {
        fieldAction.form.value = { name: '', type: 'string' }
        fieldAction.isEdit.value = false
      }
    }
    // 字段编辑
    const fieldCurrentSelected = ref<{ keys: Key[]; rows: Field[] }>({ keys: [], rows: [] })
    const fieldSelected = (keys: Key[], rows: any[]) => {
      fieldCurrentSelected.value.keys = keys
      fieldCurrentSelected.value.rows = rows
    }

    return () =>
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
          dataSource={fields.value}
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
  }
})
