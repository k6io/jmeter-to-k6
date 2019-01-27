const ind = require('../ind')
const strip = require('../strip')
const text = require('../text')
const merge = require('../merge')
const elements = require('../elements')
const value = require('../value')
const makeResult = require('../result')

function SetupThreadGroup (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  const settings = {}
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const children = node.children
  const props = children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, settings, result)
  const els = children.filter(node => !/Prop$/.test(node.name))
  const childrenResult = elements(els, context)
  if (infinite(settings)) {
    if (childrenResult.logic) {
      childrenResult.setup += childrenResult.logic
      delete childrenResult.logic
    }
    merge(result, childrenResult)
  } else {
    const childrenLogic = childrenResult.logic || ''
    delete childrenResult.logic
    merge(result, childrenResult)
    result.setup += '' +
`if (__ITER < ${settings.iterations}) {
${ind(strip(childrenLogic))}
}`
  }
  return result
}

function infinite (settings) {
  return (
    !('infinite' in settings || 'iterations' in settings) ||
    settings.infinite ||
    settings.iterations < 0
  )
}

function attribute (node, key, result) {
  switch (key) {
    case 'enabled':
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break
    default: throw new Error('Unrecognized SetupThreadGroup attribute: ' + key)
  }
}

function property (node, context, settings, result) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'num_threads':
    case 'ramp_time':
    case 'on_sample_error':
    case 'scheduler':
    case 'duration':
    case 'delay':
    case 'delayedStart':
      break
    case 'comments': {
      const comments = value(node, context)
      if (comments) result.setup += `\n\n/* ${comments} */`
      break
    }
    case 'main_controller': {
      const props = node.children.filter(node => /Prop$/.test(node.name))
      for (const prop of props) iterations(prop, context, settings, result)
      break
    }
  }
}

function iterations (node, context, settings, result) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'continue_forever':
      settings.infinite = (value(node, context) === 'true')
      break
    case 'loops':
      settings.iterations = Number.parseInt(text(node.children), 10)
      break
    default:
      throw new Error('Unrecognized ThreadGroup iteration property: ' + name)
  }
}

module.exports = SetupThreadGroup
