module.exports = (...args) => { return element(...args) }

const Fake = require('./element/Fake')
const jmeterTestPlan = require('./element/jmeterTestPlan')

/**
 * Convert element
 *
 * @param {object} node - Parsed element.
 *
 * @return {ConvertResult}
 */
function element (node) {
  switch (node.name) {
    case 'Fake': return Fake(node)
    case 'jmeterTestPlan': return jmeterTestPlan(node)
    default: throw new Error('Unrecognized element: ' + node.name)
  }
}
