var OpenapiClient = class extends BaseOpenapiClient {
  get(uri, opts) {
    return this.request(uri, 'get', opts);
  }

  post(uri, opts) {
    return this.request(uri, 'get', opts);
  }

  put(uri, opts) {
    return this.request(uri, 'get', opts);
  }

  delete(uri, opts) {
    return this.request(uri, 'get', opts);
  }

  pickContentTypes(uri, method) {
    return contentTypesOpenapiClient[method + ' ' + uri] || [void 0, void 0];
  }
};

const contentTypesOpenapiClient = {
  'put /users/avatar': ['multipart/form-data', void 0],
};
