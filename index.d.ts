import { Request, DynamoDB, AWSError } from 'aws-sdk'

interface ParamBuilder {
  index: (indexName: string, partitionKeyValues: { [key: string]: any }) => this
}

export declare namespace Params {
  function table(name: string): ParamBuilder
}

export declare namespace Dynamo {
  /**
   * Initialise the DynamoDB client.
   * @param params AWS client parameters.
   */
  function init(params: { region: string; accessKeyId: string }): any
  function query(
    requestBuilder: any
  ): Request<DynamoDB.Types.QueryOutput, AWSError>
}
