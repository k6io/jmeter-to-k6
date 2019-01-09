const route = {
  'com.atlantbh.jmeter.plugins.jsonutils.jsonpathassertion.JSONPathAssertion':
    require('../element/JSONPathAssertion'),
  ConfigTestElement: require('../element/ConfigTestElement'),
  DurationAssertion: require('../element/DurationAssertion'),
  ResponseAssertion: require('../element/ResponseAssertion')
}

function extractDefaults (node, defaults = []) {
  const values = {}
  const configs = node.children.filter(
    item => item.type === 'element' && item.name in route
  )
  for (const config of configs) {
    const { defaults: [ configValues ] } = route[config.name](config)
    for (const key of Object.keys(configValues)) {
      if (!(key in values)) values[key] = {}
      Object.assign(values[key], configValues[key])
    }
  }
  node.children = node.children.filter(
    item => !(item.type === 'element' && item.name in route)
  )
  return [ ...defaults, values ]
}

module.exports = extractDefaults