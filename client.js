import DynamoDB from 'aws-sdk/clients/dynamodb.js'

async function tryRequest(requestObject, request) {
  try {
    return await request.promise()
  } catch (err) {
    throw new Error(
      `${err.code}\n${err.message}\n${JSON.stringify(
        requestObject.compile(),
        null,
        2
      )}`
    )
  }
}

async function* pagesGenerator(requestBuilder, pageFunc) {
  const req = requestBuilder.compile()
  while (true) {
    const pageResult = await tryRequest(pageFunc(req))
    yield pageResult.Items

    if (pageResult.LastEvaluatedKey) {
      req.ExclusiveStartKey = pageResult.LastEvaluatedKey
    } else {
      break
    }
  }
}

function createClient(params) {
  const documentClient = new DynamoDB.DocumentClient(params)
  return {
    get(requestBuilder) {
      return tryRequest(
        requestBuilder,
        documentClient.get(requestBuilder.compile())
      )
    },
    scan(requestBuilder) {
      return tryRequest(
        requestBuilder,
        documentClient.scan(requestBuilder.compile())
      )
    },
    async query(requestBuilder) {
      const result = await tryRequest(
        requestBuilder,
        documentClient.query(requestBuilder.compile())
      )
      return result.Items
    },
    scanPages(requestBuilder) {
      return pagesGenerator(requestBuilder, getDocumentClient.scan)
    },
    queryPages(requestBuilder) {
      return pagesGenerator(requestBuilder, getDocumentClient.query)
    },
    async queryAll(requestBuilder) {
      let results = []
      for await (const page of queryPages(requestBuilder)) {
        results = results.concat(page)
      }
      return results
    },
  }
}

export { createClient }
