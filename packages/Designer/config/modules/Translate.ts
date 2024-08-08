import events from './languages/events'
import gateway from './languages/gateway'
import other from './languages/other'
import tasks from './languages/tasks'

const languages = {
  ...events,
  ...gateway,
  ...other,
  ...tasks
}

function getByKey(obj: any, key: String) {
  for (const objKey of Object.keys(obj)) {
    if (objKey.replace(/\s*/g, '').toUpperCase() === key.replace(/\s*/g, '').toUpperCase()) {
      return obj[objKey]
    }
  }
  return null
}

export function customTranslate(template: string, replacements?: Record<string, string>) {
  replacements = replacements || {}

  // Translate
  const val = getByKey(languages, template)
  template = val || template

  // Replace
  return template.replace(/{([^}]+)}/g, function (_, key) {
    return replacements![key] || '{' + key + '}'
  })
}

export default {
  translate: ['value', customTranslate]
}
