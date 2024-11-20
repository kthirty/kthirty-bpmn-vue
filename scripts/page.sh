# /bin/bash

# 确保脚本抛出遇到的错误
set -e

# 清理历史
pnpm clean

# 打包生成预览文件
pnpm build:example

# 打包生成文档文件
pnpm docs:build

# 将doc移动到dist下
cp -r docs/.vitepress/dist dist/docs

# 提交打包静态网站到 github-pages 分支
cd dist
git init
git add .
git commit -m 'deploy'

# 部署到 https://<username>.github.io/<repo>
git push -f git@github.com:kthirty/kthirty-bpmn-vue.git main:github-pages
