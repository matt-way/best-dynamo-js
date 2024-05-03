// this is a proxy for building dynamo param objects

import {
  exclusiveStartKey,
  index,
  item,
  key,
  projection,
  table,
} from './basic_config.js'

import { filter } from './filter.js'
import { keyCondition } from './key_condition.js'

const functionMap = {
  table,
  key,
  item,
  exclusiveStartKey,
  index,
  projection,
  keyCondition,
  filter,
}

function createAliasManager() {
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

  return {
    createAlias,
    getAliases: () => aliases,
  }
}

const Params = new Proxy(
  {
    params: {},
    aliasManager: createAliasManager(),
  },
  {
    get(target, property, receiver) {
      return (...args) => {
        if (property === 'compile') {
          return {
            ...target.aliasManager.getAliases(),
            ...target.params,
          }
        }

        if (!functionMap[property]) {
          throw new Error(`Method ${property} is not a valid Params function`)
        }

        Object.assign(
          target.params,
          functionMap[property](...args, target.aliasManager.createAlias)
        )

        return receiver
      }
    },
  }
)

export default Params
