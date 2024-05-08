# best-dynamo-js

# Why

DynamoDB is a great scalable DB, but it still has lots of frictions with regards to developer experience. This repo was created to be the best toolkit for addressing these frictions in js. It leverages the v3 `@aws-sdk/client-dynamodb`, as well as the `@aws-sdk/lib-dynamodb` enhancement library.

# Goal

To create the best, most useful set of middlewares and utility commands to make your experience with dynamo in js better.

# Usage

    npm install best-dynamo-js

## Middlewares

In order to use the middlewares, they simply need to be imported and added to the middlewareStack that is part of the dynamo client. For example:

```
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { commands, middlewares } from 'best-dynamo-js'

const client = DynamoDBDocument.from(new DynamoDB({ ...config }))

// add a middleware to the stack (without options the default is for the initialisation step)
client.middlewareStack.add(middlewares.attributeEnhancer)
```

Below is the current list of available middlewares:

- `attributeEnhancer`

The most annoying thing about using dynamo is having to create aliases for attributes and values throughout your requests. This middleware automatically generates these aliases for you behind the scenes, allowing you to make far simpler, and readable requests. For example:

```
const response = await client.query({
  TableName: 'my-table',
  IndexName: 'my-index',
  KeyCondition: 'some_variable > 5 and some_text = "hello",
  ProjectionExpression: 'keyA, keyB, keyC'
})
```

This will automatically parse the values, and generate appropriate aliases behind the scenes, transforming the input into valid dynamo input.

## Commands

A lot of the time when using dynamo you find yourself rewriting common utility functions for doing things that should probably be built in. While built in commands within dynamo can be called via `client.command`, these utility functions require `client` to usually be passed in as the first param. This it to maintain extensibility with this repo, and not step on dynamos toes. Below are the available extra commands:

- `queryAll(client, input)`

This automatically manages `ExclusiveStartKey` pagination, and returns the full item set for a given query:

```
const items = await queryAll(client, {
  TableName: 'my-table',
  KeyCondition: 'test = "something"
})
```

- `scanAll(client, input)`

This is similar to the queryAll function, but for scanning. It handles pagination behind the scenes and returns the full scanned set:

```
const items = await scanAll(client, {
  TableName: 'my-table'
})
```

# Credits

This library was built [@Wethrift](https://www.wethrift.com)
