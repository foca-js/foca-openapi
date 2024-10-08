import qs from 'query-string';
import objectToFormData from 'object-to-formdata';

export const utils = {
  /**
   * 路由拼接查询字符串
   */
  uriConcatQuery(uri: string, query: Record<string, any> | undefined) {
    if (!query) return uri;

    const querystring = qs.stringify(query, { arrayFormat: 'bracket' });
    if (!querystring) return uri;

    if (uri.includes('?')) {
      if (!uri.endsWith('?')) {
        uri += '&';
      }
    } else {
      uri += '?';
    }

    return (uri += querystring);
  },
  formatBody(
    contentType: string,
    body: object | undefined,
    formData?: FormData,
  ): object | FormData | undefined {
    if (!body) return;
    return contentType === 'multipart/form-data'
      ? objectToFormData.serialize(body, {}, formData)
      : body;
  },
};
