const creatDemoComponent = async (context, content, name) => {
  const isHTML = /\`\`\`\s*html/.test(content)
  const isPlainComponent = /^\s*\<template\>/.test(content) || /\`\`\`/.test(content)
  const wrapTemplate = code => `<template>\n<div>\n${code}\n</div>\n</template>`

  if (isHTML) {
    content = content.replace(/\`\`\`\s*html([\s\S]*)\`\`\`/, wrapTemplate('$1'))
  } else if (!isPlainComponent) {
    content = wrapTemplate(content)
  }

  await context.writeTemp(`dynamic/demo/${name}.vue`, content, { encoding: 'utf8' })
}

module.exports = {
  creatDemoComponent
} 