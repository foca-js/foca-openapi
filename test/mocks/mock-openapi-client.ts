import { BaseOpenapiClient } from '../../src';

export class MockOpenapiClient extends BaseOpenapiClient {
  protected override getContentTypes(
    _uri: string,
    _method: string,
  ): [
    BaseOpenapiClient.UserInputOpts['requestBodyType'],
    BaseOpenapiClient.UserInputOpts['responseType'],
  ] {
    return [void 0, void 0];
  }
}
