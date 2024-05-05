async function* pageCommandGenerator(client, command, initialParams) {
  while (true) {
    const pageResult = await client[command](initialParams)
    yield pageResult.Items
    if (pageResult.LastEvaluatedKey) {
      initialParams.ExclusiveStartKey = pageResult.LastEvaluatedKey
    } else {
      break
    }
  }
}

async function pageAll(client, command, input) {
  let results = []
  for await (const page of pageCommandGenerator(client, command, input)) {
    results = results.concat(page)
  }
  return results
}

async function queryAll(client, input) {
  return pageAll(client, 'query', input)
}

async function scanAll(client, input) {
  return pageAll(client, 'scan', input)
}

export { queryAll, scanAll }
