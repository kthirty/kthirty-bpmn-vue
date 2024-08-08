---
layout: home

title: KThirty Bpmn Vue
titleTemplate: KThirty Bpmn Vue Library

hero:
  name: KThirty Bpmn Vue
  text: 可视化流程编辑器
  tagline: 基于 Vue3 + TypeScript + Vite 开发
  image:
    src: /amazing-logo.svg
    alt: KThirty Bpmn Vue
  actions:
    - theme: brand
      text: Get Started
      link: /guide/features
features:
  - icon: 🛠️
    title: 最新的技术
    details: '采用 Vue@3.4.34 + TypeScript@5.5.4 + Vite@5.3.5 + Less@4.2.0'
  - icon: 🚀
    title: 开箱即可用
    details: 使用BPMN-JS
  - icon: ⚡️
    title: 单文件组件
    details: '所有组件均为 JSX'
---

<Watermark fullscreen content="KThirty Bpmn Vue" />

<script setup lang="ts">
import { onMounted } from 'vue'
import { fetchVersion } from './.vitepress/utils/fetchVersion'
import pkg from '../package.json'

const dependencies = pkg.dependencies
const devDependencies = pkg.devDependencies
function getVersion (target: string): string {
  for (let name of Object.keys(dependencies)) {
    if (name === target) {
      return dependencies[name].replace('^', '')
    }
  }
  for (let name of Object.keys(devDependencies)) {
    if (name === target) {
      return devDependencies[name].replace('^', '')
    }
  }
  return ''
}
function fetchDesc () {
  const featureDetails: any = document.querySelector('div.VPFeatures.VPHomeFeatures > div.container > div.items :first-child > div.VPLink.no-icon.VPFeature .box > p.details')
  const developDesc = `采用 Vue@${getVersion('vue')} + TypeScript@${getVersion('typescript')} + Vite@${getVersion('vite')} + Less@${getVersion('less')}`
  featureDetails.textContent = developDesc
}
onMounted(() => {
  fetchVersion()
  fetchDesc()
})
</script>
