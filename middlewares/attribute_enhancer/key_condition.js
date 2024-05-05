import * as parser from './key_condition_parser.js'

function compileCondition(condition, createAlias) {
  const { attribute, operator, values } = condition
  const { aliasAttribute, aliasValues } = createAlias(attribute, values)
  return `${aliasAttribute} ${operator} ${aliasValues.join(' and ')}`
}

function keyConditionHandler(conditionString, createAlias) {
  const result = parser.parse(conditionString)

  return result.map(item => compileCondition(item, createAlias)).join(' and ')
}

export { keyConditionHandler }
