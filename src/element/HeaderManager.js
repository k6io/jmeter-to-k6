const properties = require('../common/properties')
const makeResult = require('../result')

function HeaderManager (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  result.constants.set('headers', new Map())
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const children = node.children
  const props = children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, result)
  return result
}

function attribute (node, key, result) {
  switch (key) {
    case 'enabled':
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break
    default: throw new Error('Unrecognized HeaderManager attribute: ' + key)
  }
}

function property (node, context, result) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'comments':
      break
    case 'headers':
      headers(node, context, result)
      break
    default: throw new Error('Unrecognized HeaderManager property: ' + name)
  }
}

function headers (node, context, result) {
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) header(prop, context, result)
}

function header (node, context, result) {
  const props = properties(node, context)
  if (!(props.name && props.value)) throw new Error('Invalid header entry')
  result.constants.get('headers').set(props.name, props.value)
}

module.exports = HeaderManager
