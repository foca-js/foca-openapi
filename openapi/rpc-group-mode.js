var OpenapiClient = class extends BaseOpenapiClient {
  user = {
    getUsers: (opts) => {
      return this.request('/users', 'get', opts);
    },
    /**
     * 获取单个用户信息
     */
    getUsersById: (opts) => {
      return this.request('/users/{id}', 'get', opts);
    },
    postUsers: (opts) => {
      return this.request('/users', 'post', opts);
    },
    /**
     * 接口已弃用，请使用 /users
     * @deprecated
     */
    postUsersV1: (opts) => {
      return this.request('/users/v1', 'post', opts);
    },
    putUsersById: (opts) => {
      return this.request('/users/{id}', 'put', opts);
    },
    putUsersAvatar: (opts) => {
      return this.request('/users/avatar', 'put', opts);
    },
    deleteUsersById: (opts) => {
      return this.request('/users/{id}', 'delete', opts);
    },
  };

  pickContentTypes(uri, method) {
    return contentTypesOpenapiClient[method + ' ' + uri] || [void 0, void 0];
  }
};

const contentTypesOpenapiClient = {
  'put /users/avatar': ['multipart/form-data', void 0],
};
