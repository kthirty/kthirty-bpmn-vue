import{d as u,v as d,c as l,G as a,B as m,o as h}from"./chunks/framework.lEB03jlH.js";function v(){return fetch("https://api.github.com/repos/kthirty/kthirty-boot-vue/contents/package.json?ref=master",{headers:{Accept:"application/vnd.github.v3.raw"}}).then(t=>t.json()).then(t=>t.version??"").then(t=>{if(!t)return;const s=document.querySelector("div.VPHero.has-image.VPHomeHero > div > div.main > p.tagline"),i=document.createElement("samp");i.classList.add("tag-version"),i.innerText=t,s==null||s.appendChild(i)})}const b="kthirty-bpmn-vue3",y="0.0.4",f="module",g=["dist","package.json","README.md"],k="./dist/kthirty-bpmn-vue.umd.cjs",V="./dist/kthirty-bpmn-vue.js",j="./dist/kthirty-bpmn-vue.js",x="dist/kthirty-bpmn-vue.iife.js",T={"./dist/style.css":"./dist/style.css","./css":"./dist/style.css",".":{import:"./dist/kthirty-bpmn-vue.js",require:"./dist/kthirty-bpmn-vue.umd.cjs"}},_={"docs:dev":"vitepress dev docs --port 8000 --open","docs:build":"vitepress build docs","docs:deploy":"sh scripts/deploy.sh","build:example":"vite build --mode example","publish:page":"sh scripts/page.sh",dev:"vite",pub:"sh scripts/publish.sh",push:"sh scripts/push.sh",build:"run-s format clean build:lib",format:"prettier --write src/ packages/",clean:"rimraf ./dist","build:lib":"run-p type-check build:es build:browser","type-check":"vue-tsc --noEmit","build:es":"vite build","build:browser":"vite -f iife build",preview:"vite preview --outDir dist --base /kthirty-bpmn-vue/",lint:"eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-pattern .gitignore"},w={"ant-design-vue":"^4.2.3","bpmn-js":"^17.9.2","bpmn-js-bpmnlint":"^0.22.3","bpmn-js-color-picker":"^0.7.1","bpmn-js-create-append-anything":"^0.5.2","bpmn-moddle":"^9.0.1",bpmnlint:"^10.3.0","core-js":"^3.38.0","lucide-vue-next":"^0.424.0",vue:"^3.4.36"},B={"vue-router":"^4.4.3","@rollup/plugin-terser":"^0.4.4","@rushstack/eslint-patch":"^1.10.4","@types/node":"^22.1.0","@vitejs/plugin-vue":"^5.1.2","@vitejs/plugin-vue-jsx":"^4.0.0","@vue/eslint-config-prettier":"^9.0.0","@vue/tsconfig":"^0.5.1",eslint:"^9.8.0","eslint-plugin-vue":"^9.27.0",less:"^4.2.0",minimist:"^1.2.8","npm-run-all":"^4.1.5",prettier:"^3.3.3",rimraf:"^6.0.1","rollup-plugin-visualizer":"^5.12.0",typescript:"^5.5.4","unplugin-vue-components":"^0.27.3",vite:"^5.3.5",vitepress:"^1.3.2","vue-tsc":"^2.0.29"},S=["dist/*"],D="Bpmn Vue Components Library.",K={type:"git",url:"git+https://github.com/kthirty/kthirty-bpmn-vue.git"},P=["Vue3","TS","Vite","Less","KThirty","Components","Bpmn","Flowable"],E="kthirty",L="MIT",C={url:"https://github.com/kthirty/kthirty-bpmn-vue/issues"},F="https://kthirty.github.io/kthirty-bpmn-vue",H=["> 1%","last 2 versions","not dead"],o={name:b,version:y,private:!1,type:f,files:g,main:k,module:V,browser:j,unpkg:x,exports:T,scripts:_,dependencies:w,devDependencies:B,sideEffects:S,description:D,repository:K,keywords:P,author:E,license:L,bugs:C,homepage:F,browserslist:H},q=JSON.parse('{"title":"KThirty Bpmn Vue","titleTemplate":"KThirty Bpmn Vue Library","description":"","frontmatter":{"layout":"home","title":"KThirty Bpmn Vue","titleTemplate":"KThirty Bpmn Vue Library","hero":{"name":"KThirty Bpmn Vue","text":"可视化流程编辑器","tagline":"基于 Vue3 + TypeScript + Vite 开发","image":{"src":"/amazing-logo.svg","alt":"KThirty Bpmn Vue"},"actions":[{"theme":"brand","text":"Get Started","link":"/guide/features"}]},"features":[{"icon":"🛠️","title":"最新的技术","details":"采用 Vue@3.4.34 + TypeScript@5.5.4 + Vite@5.3.5 + Less@4.2.0"},{"icon":"🚀","title":"开箱即可用","details":"使用BPMN-JS"},{"icon":"⚡️","title":"单文件组件","details":"所有组件均为 JSX"}]},"headers":[],"relativePath":"index.md","filePath":"index.md"}'),M={name:"index.md"},J=u({...M,setup(t){const s=o.dependencies,i=o.devDependencies;function r(n){for(let e of Object.keys(s))if(e===n)return s[e].replace("^","");for(let e of Object.keys(i))if(e===n)return i[e].replace("^","");return""}function p(){const n=document.querySelector("div.VPFeatures.VPHomeFeatures > div.container > div.items :first-child > div.VPLink.no-icon.VPFeature .box > p.details"),e=`采用 Vue@${r("vue")} + TypeScript@${r("typescript")} + Vite@${r("vite")} + Less@${r("less")}`;n.textContent=e}return d(()=>{v(),p()}),(n,e)=>{const c=m("Watermark");return h(),l("div",null,[a(c,{fullscreen:"",content:"KThirty Bpmn Vue"})])}}});export{q as __pageData,J as default};