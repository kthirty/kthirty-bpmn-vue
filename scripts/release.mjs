import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const registry = 'https://registry.npmjs.org'
const level = process.argv[2] || 'patch'

if (!['patch', 'minor', 'major'].includes(level)) {
  console.error('用法: pnpm release [patch|minor|major]')
  process.exit(1)
}

const run = (command) => execSync(command, { cwd: root, stdio: 'inherit', shell: true })

run(`pnpm whoami --registry ${registry}`)
run('git rev-parse --is-inside-work-tree')
run('git remote get-url origin')

run(`pnpm version ${level} --no-git-tag-version --no-git-checks`)

const version = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')).version
console.log(`发布版本 ${version}`)

run('pnpm build')
run('git add -A')
run(`git commit -m "release: ${version}"`)
run(`pnpm publish --registry ${registry} --ignore-scripts --no-git-checks`)
run(`git tag v${version}`)
run('git push -u origin HEAD')
run('git push origin --tags')

console.log(`已发布 ${version}，并推送到远程`)
