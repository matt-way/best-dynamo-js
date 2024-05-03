import * as parser from './filter_parser.js'

function compileGroup(group, createAlias) {
  if (!group.type) {
    return compileCondition(group, createAlias)
  }

  const { conditions, type } = group
  return `(${conditions
    .map(c => compileGroup(c, createAlias))
    .join(` ${type} `)})`
}

function compileCondition(condition, createAlias) {
  const { attribute, operator, values } = condition
  const { aliasAttribute, aliasValues } = createAlias(attribute, values)
  return `${aliasAttribute} ${operator} ${aliasValues.join(' and ')}`
}

function filter(filterString, createAlias) {
  const result = parser.parse(filterString)
  return {
    FilterExpression: compileGroup(result, createAlias),
  }
}

export { filter }
