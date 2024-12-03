import { defineConfig } from 'vitepress'

export default defineConfig({
  title: `KThirty Bpmn Vue`,
  description: '可视化流程编辑器',
  base: '/kthirty-bpmn-vue/docs/',

  head: [
    // 网站图标
    ['link', { rel: 'icon', type: 'image/svg+xml', href: 'https://cn.vitejs.dev/viteconf.svg' }]
    // ['link', { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' }],
  ],
  appearance: true, // 默认 true，设为 false 则无法切换dark/light主题，可选 'dark' true false
  markdown: {
    lineNumbers: false // 是否显示行数，默认false
  },
  themeConfig: {
    logo: '/amazing-icon.svg',

    editLink: {
      pattern: 'https://github.com/kthirty/kthirty-boot-vue/tree/master/docs/:path',
      text: 'Suggest changes to this page'
    },
    // 默认支持icon包括：'discord'|'facebook'|'github'|'instagram'|'linkedin'|'mastodon'|'slack'|'twitter'|'youtube'
    socialLinks: [
      { icon: 'github', link: 'https://github.com/kthirty/kthirty-boot-vue' }
      // 自定义icon
      // {
      //   icon: {
      //     svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Dribbble</title><path d="M12...6.38z"/></svg>'
      //   },
      //   link: 'https://www.npmjs.com/package/kthirty-bpmn-vue'
      // }
    ],

    // search: {
    //   // vitepress 内置 search
    //   provider: 'local'
    // },

    algolia: {
      // algolia 搜索服务 与 内置 search 可二选一
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present The Muse Catcher'
    },

    nav: [
      {
        text: '链接',
        items: [
          { text: 'Github', link: 'https://github.com/kthirty' },
          { text: 'Preview', link: 'https://blog.kthirty.top/kthirty-bpmn-vue/' },
          { text: 'bpmn-js', link: 'https://bpmn.io/' },
          { text: 'vue', link: 'https://cn.vuejs.org/' },
          { text: 'vitepress', link: 'https://vitepress.dev/' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指引',
          items: [
            {
              text: '简介',
              link: '/guide/features'
            },
            {
              text: '快速上手',
              link: '/guide/started'
            },
            {
              text: '更新日志',
              link: '/guide/changelog'
            }
          ]
        }
      ]
    }
  }
})
