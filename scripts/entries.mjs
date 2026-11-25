import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const components = ['BpmnDesigner', 'Designer', 'Panel', 'Toolbar', 'SelectableDrawer']
const dir = resolve(root, 'dist/entries')
mkdirSync(dir, { recursive: true })

for (const name of components) {
  writeFileSync(resolve(dir, `${name}.js`), `export { ${name} as default, ${name} } from '../kthirty-bpmn-vue.js'\n`)
  writeFileSync(
    resolve(dir, `${name}.cjs`),
    `'use strict'\nconst lib = require('../kthirty-bpmn-vue.umd.cjs')\nconst component = lib.${name}\nmodule.exports = component\nmodule.exports.default = component\n`
  )
}

const stripStyleImport = (directory) => {
  for (const name of readdirSync(directory)) {
    const file = resolve(directory, name)
    if (statSync(file).isDirectory()) {
      stripStyleImport(file)
      continue
    }
    if (!file.endsWith('.d.ts')) continue
    const source = readFileSync(file, 'utf8')
    const next = source.replace(/^import ['"][^'"]+\.(less|css)['"];\r?\n/gm, '')
    if (next !== source) writeFileSync(file, next)
  }
}

stripStyleImport(resolve(root, 'dist/types'))
