const path = require('path')
const markdownItContainer = require('markdown-it-container')

const { creatDemoComponent, hashCode } = require('./utils')
const createDemoOptions = require('./module/mkitc-demo')

const Plugin = (pluginOptions, context) => ({
  name: 'vuepress-plugin-code-container',
  extendMarkdown: md => {
    md.use(markdownItContainer, 'demo', createDemoOptions(context))
  },
  enhanceAppFiles() {
    return {
      name: 'dynamic-code',
      content: `
        export default ({ Vue, router }) => {
          Vue.component('DemoBlock', () => import('${path.resolve(__dirname, './components/DemoBlock.vue')}'))
        }
       `
    }
  },
  extendPageData($page) {
    let { _content: content, key, relativePath } = $page

    if (typeof content === 'string') {
      let demoCodes = content.split(/:::/).filter(s => /^\s+demo/.test(s))

      demoCodes.forEach(async (code, index) => {
        let t = code.split(/```[\s\S]*?(?=\<)/)
        const tagName = `demo-block-${relativePath ? hashCode(relativePath) : key}-${index}`

        if (t.length > 1) {
          code = t.slice(1).join('')
        }

        await creatDemoComponent(context, code, tagName)
      })
    }
  },
  plugins: [
    [
      '@vuepress/register-components',
      {
        componentsDir: path.resolve(context.tempPath, 'dynamic/demo')
      }
    ]
  ]
})

module.exports = Plugin