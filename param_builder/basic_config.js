function table(tableName) {
  return {
    TableName: tableName,
  }
}

function key(keyValueObject) {
  return {
    Key: keyValueObject,
  }
}

function item(itemObject) {
  return {
    Item: itemObject,
  }
}

function exclusiveStartKey(exclusiveStartKey) {
  return {
    ExclusiveStartKey: exclusiveStartKey,
  }
}

function index(indexName) {
  return {
    IndexName: indexName,
  }
}

function projection(keys, createAlias) {
  return {
    ProjectionExpression: keys.map(createAlias).join(', '),
  }
}

export { table, key, item, exclusiveStartKey, index, projection }
