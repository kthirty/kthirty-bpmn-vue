# /bin/bash

# 确保脚本抛出遇到的错误
set -e

# 读取 package.json 中的 version
version=`jq -r .version package.json`

# 打包构建
pnpm build



# 发布到 npm，pnpm(高性能的npm)
pnpm publish

# 升级 kthirty-boot-vue 依赖版本
# pnpm up kthirty-boot-vue@$version

# 提交版本更新代码到 github
# git add .
# git commit -m "update $version"
# git push

# 重新部署文档
pnpm docs:deploy
