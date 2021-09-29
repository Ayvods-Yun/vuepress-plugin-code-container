const { hashCode } = require('../utils')

module.exports = (context) => {
  let tagNameIndex = 0

  function validate(params) {
    return /^demo\s+(.*)$/.test(params.trim())
  }
  
  function render(tokens, idx, options, env, self) {
    const m = tokens[idx].info.trim().match(/^demo\s+(.*)$/)

    if (tokens[idx].nesting === 1) {
      const description = m && m.length > 1 ? m[1] : ''

      const reset = tokens.slice(0, idx).filter(_ => _.type === 'container_demo_open').length === 0
      if (reset) {
        tagNameIndex = 0
      } else {
        tagNameIndex++
      }

      let key = env.relativePath.match(/temp-pages\/(.*?)\.md/)
      if (key) {
        key = key[1]
      } else {
        key = hashCode(env.relativePath)
      }
  
      const tagName = `demo-block-${key}-${tagNameIndex}`
  
      return `
        <demo-block>
          <template slot="source"><${tagName} /></template>
          ${description ?? `<div>${mkit.render(description)}</div>`}
          <template slot="code">
      `
    }
    return '</template></demo-block>'
  }

  return {
    validate,
    render
  }
}