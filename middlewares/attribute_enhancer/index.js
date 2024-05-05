// middleware that removes the need to do attribute work

import { filterHandler } from './filter.js'
import { keyConditionHandler } from './key_condition.js'
import { projectionHandler } from './projection.js'

const keyMap = {
  KeyConditionExpression: keyConditionHandler,
  FilterExpression: filterHandler,
  ProjectionExpression: projectionHandler,
}

const attributeEnhancer = next => args => {
  const aliases = {}

  let aliasCount = 0
  function createAlias(key, values = []) {
    if (!aliases.ExpressionAttributeNames) {
      aliases.ExpressionAttributeNames = {}
    }
    const aliasAttribute = `#${aliasCount}`
    aliases.ExpressionAttributeNames[aliasAttribute] = key

    if (values.length > 0 && !aliases.ExpressionAttributeValues) {
      aliases.ExpressionAttributeValues = {}
    }
    const aliasValues = values.map((value, i) => {
      const valueAlias = `:${aliasCount}_${i}`
      aliases.ExpressionAttributeValues[valueAlias] = value
      return valueAlias
    })
    aliasCount++
    return { aliasAttribute, aliasValues }
  }

  Object.keys(args.input).forEach(key => {
    if (keyMap[key]) {
      args.input[key] = keyMap[key](args.input[key], createAlias)
    }
  })
  Object.assign(args.input, aliases)
  return next(args)
}

export { attributeEnhancer }
