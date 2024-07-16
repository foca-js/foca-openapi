import type { OpenapiClientAdapter } from '../lib/adapter';

/**
 * fetch适配器，也可以传入模拟的fetch
 */
export const fetchAdapter = (opts: {
  /**
   * 默认使用环境内置的fetch，也可以传入模拟的fetch
   */
  fetch?: typeof fetch;
  /**
   * 包含域名的地址，每次请求前都会拼接
   */
  baseURL: string;
  /**
   * fetch的默认参数，每次请求前都会合并对象
   */
  fetchDefaultOptions?: RequestInit;
}): OpenapiClientAdapter => {
  const { fetch: fetcher = fetch, baseURL, fetchDefaultOptions = {} } = opts;

  return {
    async request(opts, utils) {
      const url = baseURL + utils.uriConcatQuery(opts.uri, opts.query);
      const body = utils.formatBody(opts.requestBodyType, opts.body);
      const credentials =
        typeof opts.credentials === 'string'
          ? opts.credentials
          : opts.credentials === true
            ? 'same-origin'
            : 'omit';

      const response = await fetcher(url, {
        ...fetchDefaultOptions,
        method: opts.method,
        body,
        headers: {
          ...((fetchDefaultOptions.headers as Record<string, any>) || {}),
          ...opts.headers,
        },
        credentials,
      });

      return opts.responseType === 'json' ? response.json() : response.text();
    },
  };
};
