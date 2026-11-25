import { computed, defineComponent, getCurrentInstance, inject, nextTick, onBeforeUnmount, onMounted, onUpdated, provide, reactive, ref, Teleport, watch, type PropType } from 'vue'

export { default as Icon } from './Icon'

export const Button = defineComponent({
  name: 'Button',
  props: {
    type: {
      type: String as PropType<'primary' | 'default' | 'text'>,
      default: 'default'
    },
    size: String as PropType<'small' | 'middle'>,
    danger: Boolean,
    disabled: Boolean
  },
  emits: ['click'],
  setup(props, { slots, emit }) {
    return () => (
      <button
        type="button"
        class={['bpmn-btn', props.type, props.size, { danger: props.danger }]}
        disabled={props.disabled}
        onClick={(event: MouseEvent) => {
          if (!props.disabled) emit('click', event)
        }}
      >
        {slots.default?.()}
      </button>
    )
  }
})

export const Space = defineComponent({
  name: 'Space',
  props: {
    size: { type: Number, default: 8 }
  },
  setup(props, { slots, attrs }) {
    return () => (
      <div class="bpmn-space" style={[{ gap: `${props.size}px` }, attrs.style as Record<string, string>]}>
        {slots.default?.()}
      </div>
    )
  }
})

export const Divider = defineComponent({
  name: 'Divider',
  props: {
    type: String as PropType<'horizontal' | 'vertical'>
  },
  setup(props, { slots }) {
    if (props.type === 'vertical') return () => <span class="bpmn-divider vertical" />
    return () => <div class="bpmn-divider">{slots.default?.()}</div>
  }
})

export const Popover = defineComponent({
  name: 'Popover',
  props: {
    content: String,
    placement: { type: String, default: 'bottom' }
  },
  setup(props, { slots }) {
    const open = ref(false)
    const root = ref<HTMLElement | null>(null)
    const panelRef = ref<HTMLElement | null>(null)
    const panelStyle = ref<Record<string, string>>({})
    const side = ref(props.placement)
    const place = () => {
      const el = root.value
      const panel = panelRef.value
      if (!el || !panel) return
      const rect = el.getBoundingClientRect()
      const margin = 8
      const width = panel.offsetWidth
      const height = panel.offsetHeight
      let left = rect.left + rect.width / 2 - width / 2
      left = Math.max(margin, Math.min(left, window.innerWidth - width - margin))
      const below = rect.bottom + margin
      const above = rect.top - height - margin
      const preferTop = props.placement === 'top'
      let top = preferTop ? above : below
      side.value = preferTop ? 'top' : 'bottom'
      if (!preferTop && top + height > window.innerHeight - margin && above >= margin) {
        top = above
        side.value = 'top'
      }
      if (preferTop && top < margin) {
        top = below
        side.value = 'bottom'
      }
      panelStyle.value = { position: 'fixed', left: `${left}px`, top: `${Math.max(margin, top)}px` }
    }
    return () => (
      <span
        ref={root}
        class="bpmn-popover"
        onMouseenter={() => {
          open.value = true
          nextTick(place)
        }}
        onMouseleave={() => (open.value = false)}
      >
        {slots.default?.()}
        <Teleport to="body">
          {open.value && (
            <span ref={panelRef} class={['bpmn-popover-content', side.value]} style={panelStyle.value}>
              {slots.content?.() || props.content}
            </span>
          )}
        </Teleport>
      </span>
    )
  }
})

export const Popconfirm = defineComponent({
  name: 'Popconfirm',
  props: {
    title: String,
    okText: { type: String, default: '确定' },
    cancelText: { type: String, default: '取消' },
    disabled: Boolean
  },
  emits: ['confirm'],
  setup(props, { slots, emit }) {
    const open = ref(false)
    const root = ref<HTMLElement | null>(null)
    const panelRef = ref<HTMLElement | null>(null)
    const panelStyle = ref<Record<string, string>>({})
    const place = () => {
      const el = root.value
      if (!el) return
      const rect = el.getBoundingClientRect()
      const margin = 8
      const width = Math.min(216, window.innerWidth - margin * 2)
      const height = panelRef.value?.offsetHeight || 92
      let left = rect.right - width
      left = Math.max(margin, Math.min(left, window.innerWidth - width - margin))
      let top = rect.bottom + margin
      if (top + height > window.innerHeight - margin) top = Math.max(margin, rect.top - height - margin)
      panelStyle.value = {
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        maxWidth: `${width}px`
      }
    }
    const close = () => {
      open.value = false
    }
    const toggle = () => {
      if (props.disabled) return
      open.value = !open.value
      if (open.value) nextTick(place)
    }
    const onDoc = (event: MouseEvent) => {
      if (!open.value) return
      const target = event.target as Node
      if (root.value?.contains(target) || panelRef.value?.contains(target)) return
      close()
    }
    onMounted(() => {
      document.addEventListener('mousedown', onDoc, true)
      window.addEventListener('resize', place)
      window.addEventListener('scroll', place, true)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('mousedown', onDoc, true)
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    })
    return () => (
      <span ref={root} class="bpmn-popconfirm">
        <span onClick={toggle}>{slots.default?.()}</span>
        <Teleport to="body">
          {open.value && (
            <span ref={panelRef} class="bpmn-popconfirm-panel" style={panelStyle.value}>
              <span class="bpmn-popconfirm-title">{props.title}</span>
              <span class="bpmn-popconfirm-actions">
                <Button size="small" onClick={close}>
                  {props.cancelText}
                </Button>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    close()
                    emit('confirm')
                  }}
                >
                  {props.okText}
                </Button>
              </span>
            </span>
          )}
        </Teleport>
      </span>
    )
  }
})

const MenuContext = Symbol('menu')

export const Dropdown = defineComponent({
  name: 'Dropdown',
  setup(_, { slots }) {
    const open = ref(false)
    return () => (
      <span class="bpmn-dropdown">
        <span onClick={() => (open.value = !open.value)}>{slots.default?.()}</span>
        {open.value && (
          <span class="bpmn-dropdown-overlay" onClick={() => (open.value = false)}>
            {slots.overlay?.()}
          </span>
        )}
      </span>
    )
  }
})

export const Menu = defineComponent({
  name: 'Menu',
  emits: ['click'],
  setup(_, { slots, emit }) {
    provide(MenuContext, (key: string | number) => emit('click', { key }))
    return () => <div class="bpmn-menu">{slots.default?.()}</div>
  }
})

export const MenuItem = defineComponent({
  name: 'MenuItem',
  setup(_, { slots }) {
    const onClick = inject<(key: string | number) => void>(MenuContext)
    const key = getCurrentInstance()?.vnode.key
    return () => (
      <button type="button" class="bpmn-menu-item" onClick={() => onClick?.(key as string)}>
        {slots.default?.()}
      </button>
    )
  }
})

export const Input = defineComponent({
  name: 'Input',
  props: {
    value: String,
    maxlength: Number,
    placeholder: String,
    readonly: Boolean,
    disabled: Boolean
  },
  emits: ['update:value', 'change'],
  setup(props, { slots, emit }) {
    const commit = (value: string) => {
      emit('update:value', value)
      emit('change', value)
    }
    return () => (
      <span class="bpmn-input-wrap">
        <input
          class="bpmn-input"
          value={props.value ?? ''}
          maxlength={props.maxlength}
          placeholder={props.placeholder}
          readonly={props.readonly}
          disabled={props.disabled}
          onInput={(event: Event) => commit((event.target as HTMLInputElement).value)}
        />
        {slots.addonAfter && <span class="bpmn-input-addon">{slots.addonAfter()}</span>}
      </span>
    )
  }
})

export const Textarea = defineComponent({
  name: 'Textarea',
  props: {
    value: String,
    placeholder: String,
    readonly: Boolean
  },
  emits: ['update:value', 'change'],
  setup(props, { slots, emit }) {
    const commit = (value: string) => {
      emit('update:value', value)
      emit('change', value)
    }
    return () => (
      <span class="bpmn-input-wrap block">
        <textarea
          class="bpmn-textarea"
          placeholder={props.placeholder}
          readonly={props.readonly}
          value={props.value ?? ''}
          onInput={(event: Event) => commit((event.target as HTMLTextAreaElement).value)}
        />
        {slots.addonAfter && <span class="bpmn-input-addon">{slots.addonAfter()}</span>}
      </span>
    )
  }
})

const sameValue = (left: unknown, right: unknown) => String(left ?? '') === String(right ?? '')

export const Select = defineComponent({
  name: 'Select',
  props: {
    value: [String, Number, Array] as PropType<string | number | Array<string | number>>,
    options: { type: Array as PropType<Array<Record<string, any>>>, default: () => [] },
    allowClear: Boolean,
    showSearch: Boolean,
    allowSearch: Boolean,
    mode: String,
    placeholder: { type: String, default: '请选择' }
  },
  emits: ['update:value', 'change'],
  setup(props, { emit }) {
    const open = ref(false)
    const keyword = ref('')
    const root = ref<HTMLElement | null>(null)
    const dropdownRef = ref<HTMLElement | null>(null)
    const inputRef = ref<HTMLInputElement | null>(null)
    const dropdownStyle = ref<Record<string, string>>({})
    const multiple = computed(() => props.mode === 'multiple')
    const searchable = computed(() => props.showSearch || props.allowSearch)
    const selectedValues = computed(() => (Array.isArray(props.value) ? props.value : []))
    const filtered = computed(() => {
      const text = keyword.value.trim().toLowerCase()
      if (!searchable.value || !text) return props.options
      return props.options.filter((item) =>
        String(item.label ?? '')
          .toLowerCase()
          .includes(text)
      )
    })
    const hasValue = computed(() => (multiple.value ? selectedValues.value.length > 0 : props.value !== undefined && props.value !== null && props.value !== ''))
    const labelOf = (value: string | number) => props.options.find((item) => sameValue(item.value, value))?.label ?? value
    const selectedLabel = computed(() => (hasValue.value && !multiple.value ? labelOf(props.value as string | number) : ''))
    const commit = (value: string | number | Array<string | number>) => {
      emit('update:value', value)
      emit('change', value)
    }
    const includes = (value: string | number) => selectedValues.value.some((item) => sameValue(item, value))
    const updatePosition = () => {
      const el = root.value
      if (!el) return
      const rect = el.getBoundingClientRect()
      const openUp = window.innerHeight - rect.bottom < 180 && rect.top > window.innerHeight - rect.bottom
      dropdownStyle.value = {
        position: 'fixed',
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        top: openUp ? 'auto' : `${rect.bottom + 4}px`,
        bottom: openUp ? `${window.innerHeight - rect.top + 4}px` : 'auto'
      }
    }
    const close = () => {
      open.value = false
      keyword.value = ''
    }
    const openMenu = () => {
      open.value = true
      nextTick(() => {
        updatePosition()
        inputRef.value?.focus()
      })
    }
    const toggle = (value: string | number) => {
      const next = includes(value) ? selectedValues.value.filter((item) => !sameValue(item, value)) : [...selectedValues.value, value]
      commit(next)
    }
    const pick = (value: string | number) => {
      if (multiple.value) {
        toggle(value)
        keyword.value = ''
        nextTick(() => inputRef.value?.focus())
        return
      }
      commit(value)
      close()
    }
    const onSelectorClick = () => {
      if (open.value && !searchable.value) close()
      else openMenu()
    }
    const onDoc = (event: MouseEvent) => {
      if (!open.value) return
      const target = event.target as Node
      if (root.value?.contains(target) || dropdownRef.value?.contains(target)) return
      close()
    }
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    onMounted(() => {
      document.addEventListener('mousedown', onDoc, true)
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('mousedown', onDoc, true)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    })
    return () => (
      <span ref={root} class={['bpmn-select', { open: open.value, multiple: multiple.value, 'has-value': hasValue.value }]}>
        <span
          class="bpmn-select-selector"
          onMousedown={(event: MouseEvent) => {
            if ((event.target as HTMLElement).tagName !== 'INPUT') event.preventDefault()
          }}
          onClick={onSelectorClick}
        >
          {multiple.value &&
            selectedValues.value.map((value) => (
              <span class="bpmn-select-tag" key={String(value)}>
                <span>{labelOf(value)}</span>
                <button
                  type="button"
                  class="bpmn-select-tag-remove"
                  onClick={(event: MouseEvent) => {
                    event.stopPropagation()
                    toggle(value)
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          {searchable.value && (multiple.value || open.value) ? (
            <input
              ref={inputRef}
              class="bpmn-select-search"
              value={keyword.value}
              placeholder={multiple.value ? (selectedValues.value.length ? '' : props.placeholder) : String(selectedLabel.value || props.placeholder)}
              onInput={(event: Event) => {
                keyword.value = (event.target as HTMLInputElement).value
                if (!open.value) openMenu()
                else nextTick(updatePosition)
              }}
              onKeydown={onKeydown}
            />
          ) : (
            !multiple.value && <span class={hasValue.value ? 'bpmn-select-value' : 'bpmn-select-placeholder'}>{hasValue.value ? selectedLabel.value : props.placeholder}</span>
          )}
          {multiple.value && !searchable.value && !selectedValues.value.length && <span class="bpmn-select-placeholder">{props.placeholder}</span>}
          {props.allowClear && hasValue.value && (
            <button
              type="button"
              class="bpmn-select-clear"
              aria-label="清除"
              onClick={(event: MouseEvent) => {
                event.stopPropagation()
                commit(multiple.value ? [] : '')
                keyword.value = ''
              }}
            >
              ×
            </button>
          )}
          <span class="bpmn-select-arrow" />
        </span>
        <Teleport to="body">
          {open.value && (
            <div ref={dropdownRef} class="bpmn-select-dropdown" style={dropdownStyle.value}>
              {filtered.value.length ? (
                filtered.value.map((item) => {
                  const active = multiple.value ? includes(item.value) : sameValue(props.value, item.value)
                  return (
                    <div
                      class={['bpmn-select-option', { active }]}
                      key={String(item.value)}
                      onMousedown={(event: MouseEvent) => event.preventDefault()}
                      onClick={() => pick(item.value)}
                    >
                      <span>{item.label}</span>
                      {active && (
                        <svg class="bpmn-select-option-check" viewBox="64 64 896 896" width="12" height="12" fill="currentColor">
                          <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z" />
                        </svg>
                      )}
                    </div>
                  )
                })
              ) : (
                <div class="bpmn-select-empty">{keyword.value ? '无匹配结果' : '暂无数据'}</div>
              )}
            </div>
          )}
        </Teleport>
      </span>
    )
  }
})

export const Switch = defineComponent({
  name: 'Switch',
  props: { checked: Boolean },
  emits: ['update:checked', 'change'],
  setup(props, { emit }) {
    return () => (
      <button
        type="button"
        class={['bpmn-switch', { on: props.checked }]}
        onClick={() => {
          emit('update:checked', !props.checked)
          emit('change', !props.checked)
        }}
      >
        <i />
      </button>
    )
  }
})

export const RadioGroup = defineComponent({
  name: 'RadioGroup',
  props: {
    value: String,
    options: { type: Array as PropType<Array<{ label: string; value: string }>>, default: () => [] }
  },
  emits: ['update:value', 'change'],
  setup(props, { emit }) {
    return () => (
      <span class="bpmn-radio">
        {props.options.map((item) => (
          <label class={['bpmn-radio-item', { checked: props.value === item.value }]}>
            <input
              type="radio"
              checked={props.value === item.value}
              onChange={() => {
                emit('update:value', item.value)
                emit('change', item.value)
              }}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </span>
    )
  }
})

const isEmptyValue = (value: unknown) => {
  if (Array.isArray(value)) return value.length === 0
  if (value == null) return true
  if (typeof value === 'string') return value.trim() === ''
  return false
}

type FormField = { label?: string; required?: boolean }
type FormApi = {
  labelCol?: { span?: number }
  validateTrigger: string
  fields: Record<string, FormField>
  errors: Record<string, string>
  getValue: (name: string) => unknown
  validateField: (name: string) => boolean
}

const FormContext = Symbol('form')

export const Form = defineComponent({
  name: 'Form',
  props: {
    model: Object,
    labelCol: Object as PropType<{ span?: number }>,
    colon: Boolean,
    validateTrigger: { type: String, default: 'change' }
  },
  setup(props, { slots, expose }) {
    const fields = reactive<Record<string, FormField>>({})
    const errors = reactive<Record<string, string>>({})
    const validateField = (name: string) => {
      const field = fields[name]
      if (!field?.required) {
        errors[name] = ''
        return true
      }
      if (isEmptyValue(props.model?.[name])) {
        errors[name] = `请填写${field.label || name}`
        return false
      }
      errors[name] = ''
      return true
    }
    const validate = () => {
      let valid = true
      Object.keys(fields).forEach((name) => {
        if (!validateField(name)) valid = false
      })
      return valid
    }
    provide(FormContext, {
      get labelCol() {
        return props.labelCol
      },
      get validateTrigger() {
        return props.validateTrigger
      },
      fields,
      errors,
      getValue: (name: string) => props.model?.[name],
      validateField
    } satisfies FormApi)
    expose({ validate, validateField })
    return () => <div class="bpmn-form">{slots.default?.()}</div>
  }
})

export const FormItem = defineComponent({
  name: 'FormItem',
  props: {
    label: String,
    name: String,
    required: Boolean,
    tooltip: String,
    labelCol: Object as PropType<{ span?: number }>
  },
  setup(props, { slots }) {
    const form = inject<FormApi | null>(FormContext, null)
    const syncField = () => {
      if (!form || !props.name) return
      form.fields[props.name] = { label: props.label, required: props.required }
    }
    syncField()
    watch(() => [props.label, props.required, props.name], syncField)
    watch(
      () => (props.name ? form?.getValue(props.name) : undefined),
      () => {
        if (props.name && form?.errors[props.name]) form.validateField(props.name)
      }
    )
    onBeforeUnmount(() => {
      if (!form || !props.name) return
      delete form.fields[props.name]
      delete form.errors[props.name]
    })
    return () => {
      const span = props.labelCol?.span ?? form?.labelCol?.span
      const width = span ? `${(span / 24) * 100}%` : undefined
      const error = props.name ? form?.errors[props.name] : ''
      return (
        <label
          class={['bpmn-field', { error: !!error }]}
          onFocusout={() => {
            if (!props.name || !form) return
            if ((form.validateTrigger || '').includes('blur') || form.errors[props.name]) form.validateField(props.name)
          }}
        >
          {props.label && (
            <span class="bpmn-field-label" style={width ? { width } : undefined} title={props.tooltip}>
              {props.required && <i class="req">*</i>}
              {props.label}
            </span>
          )}
          <span class="bpmn-field-control">
            {slots.default?.()}
            {error && <span class="bpmn-field-error">{error}</span>}
          </span>
        </label>
      )
    }
  }
})

export const FormItemRest = defineComponent({
  name: 'FormItemRest',
  setup(_, { slots }) {
    return () => <>{slots.default?.()}</>
  }
})

export const ConfigProvider = defineComponent({
  name: 'ConfigProvider',
  props: {
    componentSize: String
  },
  setup(_, { slots }) {
    return () => <>{slots.default?.()}</>
  }
})

export const Row = defineComponent({
  name: 'Row',
  setup(_, { slots }) {
    return () => <div class="bpmn-row">{slots.default?.()}</div>
  }
})

export const Col = defineComponent({
  name: 'Col',
  props: { span: Number },
  setup(props, { slots }) {
    return () => <div style={{ width: `${((props.span || 24) / 24) * 100}%` }}>{slots.default?.()}</div>
  }
})

const CollapseContext = Symbol('collapse')

export const Collapse = defineComponent({
  name: 'Collapse',
  props: {
    accordion: Boolean,
    ghost: Boolean
  },
  setup(props, { slots }) {
    const active = ref<string | number | null>(null)
    provide(CollapseContext, {
      active,
      toggle(key: string | number) {
        active.value = props.accordion && active.value === key ? null : key
      },
      register(key: string | number) {
        if (active.value == null) active.value = key
      }
    })
    return () => <div class={['bpmn-collapse', { ghost: props.ghost }]}>{slots.default?.()}</div>
  }
})

export const CollapsePanel = defineComponent({
  name: 'CollapsePanel',
  setup(_, { slots }) {
    const api = inject<{
      active: { value: string | number | null }
      toggle: (key: string | number) => void
      register: (key: string | number) => void
    }>(CollapseContext)
    const key = (getCurrentInstance()?.vnode.key ?? 'panel') as string | number
    onMounted(() => api?.register(key))
    return () => {
      const opened = api?.active.value === key
      return (
        <section class={['bpmn-collapse-item', { active: opened }]}>
          <button type="button" class="bpmn-collapse-header" onClick={() => api?.toggle(key)}>
            <span class="bpmn-collapse-title">{slots.header?.()}</span>
            <i class={['bpmn-collapse-arrow', { open: opened }]} />
          </button>
          {opened && <div class="bpmn-collapse-body">{slots.default?.()}</div>}
        </section>
      )
    }
  }
})

const drawerClosers: Array<() => void> = []

const resolveDrawerWidth = (width: string | number) => {
  if (typeof width === 'number') return `${width}px`
  if (width.trim().endsWith('%')) return `${parseFloat(width)}vw`
  return width
}

export const Drawer = defineComponent({
  name: 'Drawer',
  props: {
    open: Boolean,
    visible: Boolean,
    title: String,
    width: { type: [String, Number], default: '360px' },
    destroyOnClose: { type: Boolean, default: true }
  },
  emits: ['update:open', 'close'],
  setup(props, { slots, emit }) {
    const shown = computed(() => !!(props.open || props.visible))
    const present = ref(false)
    const motion = ref(false)
    const zIndex = ref(1000)
    let timer = 0
    const close = () => {
      if (!shown.value) return
      emit('update:open', false)
      emit('close')
    }
    const playOpen = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          motion.value = true
        })
      })
    }
    watch(
      shown,
      (value) => {
        window.clearTimeout(timer)
        const index = drawerClosers.indexOf(close)
        if (value) {
          if (index < 0) drawerClosers.push(close)
          zIndex.value = 1000 + drawerClosers.length * 10
          const already = present.value
          present.value = true
          if (!already) motion.value = false
          playOpen()
          return
        }
        if (index >= 0) drawerClosers.splice(index, 1)
        if (!present.value) return
        motion.value = false
        timer = window.setTimeout(() => {
          if (!shown.value) present.value = false
        }, 300)
      },
      { immediate: true }
    )
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && drawerClosers[drawerClosers.length - 1] === close) close()
    }
    onMounted(() => document.addEventListener('keydown', onKeydown))
    onBeforeUnmount(() => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', onKeydown)
      const index = drawerClosers.indexOf(close)
      if (index >= 0) drawerClosers.splice(index, 1)
    })
    return () =>
      present.value ? (
        <Teleport to="body">
          <div class={['bpmn-drawer-mask', { open: motion.value }]} style={{ zIndex: zIndex.value }} onClick={close}>
            <aside class="bpmn-drawer" style={{ width: resolveDrawerWidth(props.width) }} onClick={(event: MouseEvent) => event.stopPropagation()}>
              <header class="bpmn-drawer-header">
                <div class="bpmn-drawer-title">{props.title}</div>
                <div class="bpmn-drawer-actions">
                  {slots.extra?.()}
                  <button type="button" class="bpmn-drawer-close" aria-label="关闭" title="关闭" onClick={close}>
                    <svg viewBox="64 64 896 896" width="16" height="16" fill="currentColor">
                      <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
                    </svg>
                  </button>
                </div>
              </header>
              <div class="bpmn-drawer-body">{slots.default?.()}</div>
            </aside>
          </div>
        </Teleport>
      ) : null
  }
})

export const Table = defineComponent({
  name: 'Table',
  props: {
    columns: { type: Array as PropType<any[]>, default: () => [] },
    dataSource: { type: Array as PropType<any[]>, default: () => [] },
    rowKey: Function as PropType<(record: any) => string>,
    rowSelection: Object as PropType<{ type?: string; selectedRowKeys?: any[]; onChange?: (keys: any[], rows: any[]) => void }>,
    pagination: { type: [Boolean, Object], default: false },
    bordered: Boolean,
    customRow: Function as PropType<(record: any, index: number) => { onClick?: () => void; style?: string }>
  },
  setup(props) {
    const localKeys = ref<any[]>([])
    const selected = computed(() => props.rowSelection?.selectedRowKeys || localKeys.value)
    const keyOf = (record: any, index: number) => (props.rowKey ? props.rowKey(record) : String(index))
    const change = (next: any[]) => {
      if (!props.rowSelection?.selectedRowKeys) localKeys.value = next
      const rows = (props.dataSource || []).filter((record, index) => next.includes(keyOf(record, index)))
      props.rowSelection?.onChange?.(next, rows)
    }
    return () => (
      <div class="bpmn-table-wrap">
        <table class={['bpmn-table', { bordered: props.bordered }]}>
          <thead>
            <tr>
              {props.rowSelection && <th class="check" />}
              {props.columns.map((column) => (
                <th style={{ textAlign: column.align, width: column.width ? `${column.width}px` : undefined }}>{column.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(props.dataSource || []).map((record, index) => {
              const extra = props.customRow?.(record, index) || {}
              const key = keyOf(record, index)
              return (
                <tr onClick={extra.onClick} style={extra.style}>
                  {props.rowSelection && (
                    <td class="check" onClick={(event: MouseEvent) => event.stopPropagation()}>
                      <input
                        class="bpmn-checkbox"
                        type="checkbox"
                        checked={selected.value.includes(key)}
                        onChange={(event: Event) => {
                          const checked = (event.target as HTMLInputElement).checked
                          change(checked ? [...selected.value, key] : selected.value.filter((item) => item !== key))
                        }}
                      />
                    </td>
                  )}
                  {props.columns.map((column) => {
                    const text = record?.[column.dataIndex]
                    return (
                      <td class={{ ellipsis: column.ellipsis }} style={{ textAlign: column.align }} title={column.ellipsis ? String(text ?? '') : undefined}>
                        {column.customRender ? column.customRender({ text, record, index }) : text}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
})

export const Tabs = defineComponent({
  name: 'Tabs',
  props: { activeKey: String },
  emits: ['update:activeKey'],
  setup(props, { slots, emit }) {
    const list = ref<HTMLElement | null>(null)
    const ink = ref({ left: '0px', width: '0px' })
    const sync = () => {
      const el = list.value?.querySelector<HTMLElement>('.bpmn-tabs-tab.on')
      if (!el) return
      const left = `${el.offsetLeft}px`
      const width = `${el.offsetWidth}px`
      if (ink.value.left === left && ink.value.width === width) return
      ink.value = { left, width }
    }
    onMounted(sync)
    onUpdated(sync)
    return () => {
      const panes = (slots.default?.() || []).filter((pane) => pane?.props)
      const current = panes.some((pane) => pane.key === props.activeKey) ? props.activeKey : panes[0]?.key
      return (
        <div class="bpmn-tabs">
          <div class="bpmn-tabs-nav">
            <div ref={list} class="bpmn-tabs-nav-list">
              {panes.map((pane) => (
                <button type="button" key={pane.key ?? undefined} class={['bpmn-tabs-tab', { on: pane.key === current }]} onClick={() => emit('update:activeKey', pane.key)}>
                  {pane.props?.tab}
                </button>
              ))}
              <i class="bpmn-tabs-ink" style={ink.value} />
            </div>
          </div>
          <div class="bpmn-tabs-content">{panes.filter((pane) => pane.key === current)}</div>
        </div>
      )
    }
  }
})

export const TabPane = defineComponent({
  name: 'TabPane',
  props: { tab: String },
  setup(_, { slots }) {
    return () => <div class="bpmn-tab-pane">{slots.default?.()}</div>
  }
})

export const PageHeader = defineComponent({
  name: 'PageHeader',
  props: {
    title: String,
    subTitle: String
  },
  setup(props) {
    return () => (
      <div class="bpmn-page-header">
        <div class="bpmn-page-header-heading">
          <span class="bpmn-page-header-title">{props.title}</span>
          {props.subTitle && <span class="bpmn-page-header-subtitle">{props.subTitle}</span>}
        </div>
      </div>
    )
  }
})

export const Modal = defineComponent({
  name: 'Modal',
  props: {
    open: Boolean,
    title: String
  },
  emits: ['update:open'],
  setup(props, { slots, emit }) {
    const close = () => emit('update:open', false)
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && props.open) close()
    }
    onMounted(() => document.addEventListener('keydown', onKeydown))
    onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
    return () =>
      props.open ? (
        <Teleport to="body">
          <div class="bpmn-modal-mask" onClick={close}>
            <div class="bpmn-modal" onClick={(event: MouseEvent) => event.stopPropagation()}>
              <header class="bpmn-drawer-header">
                <div class="bpmn-drawer-title">{props.title}</div>
                <button type="button" class="bpmn-drawer-close" aria-label="关闭" title="关闭" onClick={close}>
                  <svg viewBox="64 64 896 896" width="16" height="16" fill="currentColor">
                    <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
                  </svg>
                </button>
              </header>
              <div class="bpmn-modal-body">{slots.default?.()}</div>
            </div>
          </div>
        </Teleport>
      ) : null
  }
})
