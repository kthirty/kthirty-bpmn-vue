import { defineComponent, onMounted, ref, watch, type PropType, type Ref } from 'vue'
import type { Element } from 'bpmn-js/lib/model/Types'
import { Button, CollapsePanel, Input, Select } from '../ui'

export function useForm<T extends object>(
  props: { element: Element },
  match: (element: Element) => boolean,
  read: (element: Element) => T
): { visible: Ref<boolean>; form: Ref<T> } {
  const visible = ref(false)
  const form = ref({} as T) as Ref<T>
  const load = () => {
    visible.value = !!props.element && match(props.element)
    if (visible.value) form.value = read(props.element)
  }
  onMounted(load)
  watch(() => props.element, load)
  return { visible, form }
}

export const Block = defineComponent({
  name: 'Block',
  props: { title: { type: String, required: true }, open: Boolean },
  setup(props, { slots }) {
    return () => (props.open ? <CollapsePanel key={props.title} v-slots={{ header: () => props.title, default: () => slots.default?.() }} /> : <div style="display: none" />)
  }
})

export const EntryList = defineComponent({
  name: 'EntryList',
  props: {
    value: { type: Array as PropType<Array<Record<string, any>>>, default: () => [] },
    fields: { type: Array as PropType<Array<{ key: string; label: string; options?: Array<{ label: string; value: string }> }>>, required: true }
  },
  emits: ['update:value', 'change'],
  setup(props, { emit }) {
    const commit = (next: Array<Record<string, any>>) => {
      emit('update:value', next)
      emit('change', next)
    }
    const edit = (index: number, key: string, value: string) => commit(props.value.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)))
    return () => (
      <div>
        {props.value.map((row, index) => (
          <div class="bpmn-entry" key={index}>
            {props.fields.map((field) =>
              field.options ? (
                <Select value={row[field.key]} options={field.options} placeholder={field.label} onChange={(value: string) => edit(index, field.key, value)} />
              ) : (
                <Input value={row[field.key]} placeholder={field.label} onChange={(value: string) => edit(index, field.key, value)} />
              )
            )}
            <Button type="text" onClick={() => commit(props.value.filter((_, itemIndex) => itemIndex !== index))}>
              删除
            </Button>
          </div>
        ))}
        <Button
          class="bpmn-entry-add"
          type="primary"
          onClick={() => commit([...props.value, Object.fromEntries(props.fields.map((field) => [field.key, field.options?.[0]?.value || '']))])}
        >
          新增
        </Button>
      </div>
    )
  }
})
