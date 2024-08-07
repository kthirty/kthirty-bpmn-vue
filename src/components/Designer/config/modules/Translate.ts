import zh_CN from '@/i18n/zh_CN'
import en_US from '@/i18n/en_US'

const languages = {
  zh_CN,
  en_US
}

const lang = sessionStorage.getItem('lang')

function getByKey(obj:any,key:String){
  for (const objKey of Object.keys(obj)) {
    if(objKey.replace(/\s*/g,"").toUpperCase() === key.replace(/\s*/g,"").toUpperCase()){
      return obj[objKey];
    }
  }
  return null;
}

export function customTranslate(template: string, replacements?: Record<string, string>) {
  replacements = replacements || {}

  const translations = languages[lang || 'zh_CN']

  // Translate
  const val = getByKey(translations.elements,template)
  template = val || template

  // Replace
  return template.replace(/{([^}]+)}/g, function (_, key) {
    return replacements![key] || '{' + key + '}'
  })
}

export default {
  translate: ['value', customTranslate]
}
