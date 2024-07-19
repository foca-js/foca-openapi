import type { OpenAPIV3 } from 'openapi-types';
import { upperFirst, camelCase } from 'lodash-es';
import { documentToMeta, type Metas } from './document-to-meta';
import { methods } from './adapter';
import prettier from 'prettier';

export const generateTemplate = async (
  docs: OpenAPIV3.Document,
  projectName: string = '',
) => {
  const className = `OpenapiClient${upperFirst(camelCase(projectName))}`;
  const metas = documentToMeta(docs);
  const dts = `
    ${generateNamespaceTpl(className, metas)}
    ${generateClassForDTS(className, metas)}
    ${generatePathRelationTpl(className, metas)}
`;

  const js = `
  ${generateClassForJS(className)}
  ${generateContentTypeTpl(className, metas)}
  `;

  return {
    [className]: {
      dts: await prettier.format(dts, { parser: 'typescript' }),
      js: await prettier.format(js, { parser: 'typescript' }),
    },
  };
};

export const generateNamespaceTpl = (className: string, metas: Metas) => {
  return `
declare namespace ${className} {
  ${methods
    .flatMap((method) => {
      let content = metas[method].flatMap((meta) => {
        let opts: string[] = [];

        (<const>['query', 'params']).forEach((key) => {
          const interfaceName = upperFirst(camelCase(meta.key + '_' + key));
          if (meta[key].types.length) {
            opts.push(`interface ${interfaceName} ${meta[key].types[0]}\n`);
          }
        });

        (<const>['body', 'response']).forEach((key) => {
          const interfaceName = upperFirst(camelCase(meta.key + '_' + key));
          if (meta[key].types.length) {
            opts.push(
              meta[key].types.length === 1
                ? `interface ${interfaceName} ${meta[key].types}\n`
                : `type ${interfaceName} =  ${meta[key].types.join(' | ')}\n`,
            );
          }
        });

        return opts;
      });
      return content;
    })
    .join('')}
}`;
};

export const generateClassForDTS = (className: string, metas: Metas) => {
  return `
declare class ${className} extends BaseOpenapiClient {
  ${methods
    .map((method) => {
      if (!metas[method].length) return '';

      const uris = metas[method].map((meta) => meta.uri);
      const optionalUris = metas[method]
        .filter(
          (meta) => meta.query.optional && meta.params.optional && meta.body.optional,
        )
        .map((meta) => meta.uri);

      let opts: string;
      if (optionalUris.length === uris.length) {
        opts = `[opts?: ${className}_${method}_paths[K]['request']]`;
      } else if (optionalUris.length === 0) {
        opts = `[opts: ${className}_${method}_paths[K]['request']]`;
      } else {
        opts = `K extends '${optionalUris.join(' | ')}' ? [opts?: ${className}_${method}_paths[K]['request']] : [opts: ${className}_${method}_paths[K]['request']]`;
      }

      return `${method}<K extends keyof ${className}_${method}_paths>(
        uri: K, ...rest: ${opts}
      ): Promise<${className}_${method}_paths[K]['response']>`;
    })
    .join('\n')}
    
    protected getContentTypes(uri: string, method: string) : [
      BaseOpenapiClient.UserInputOpts['requestBodyType'],
      BaseOpenapiClient.UserInputOpts['responseType'],
    ];
}
  `;
};

export const generateClassForJS = (className: string) => {
  return `
var ${className} = class extends BaseOpenapiClient {
  get(uri, ...rest) {
    return this.request(uri, "get", rest[0] || {});
  }

  post(uri, ...rest) {
    return this.request(uri, "post", rest[0] || {});
  }

  put(uri, ...rest) {
    return this.request(uri, "put", rest[0] || {});
  }

  patch(uri, ...rest) {
    return this.request(uri, "patch", rest[0] || {});
  }

  delete(uri, ...rest) {
    return this.request(uri, "delete", rest[0] || {});
  }

  getContentTypes(uri, method) {
    return contentTypes${className}[uri + " " + method] || [void 0, void 0];
  }
};`;
};

export const generateContentTypeTpl = (className: string, metas: Metas) => {
  return `
  const contentTypes${className} = {
  ${methods
    .map((method) => {
      if (!metas[method].length) return '';

      return `
        ${metas[method]
          .map(({ uri, contentTypes, responseTypes }) => {
            const requestContentType = contentTypes[0] || 'application/json';
            const responseContentType = responseTypes.some((item) =>
              item.startsWith('text/'),
            )
              ? 'text'
              : 'json';
            const isJSONRequest = requestContentType === 'application/json';
            const isJSONResponse = responseContentType === 'json';

            if (isJSONRequest && isJSONResponse) return '';

            return `'${method} ${uri}': [${isJSONRequest ? 'void 0' : `'${requestContentType}'`}, ${isJSONResponse ? 'void 0' : `'${responseContentType}'`}],`;
          })
          .join('\n')}
      `;
    })
    .join('')}
};
  `;
};

export const generatePathRelationTpl = (className: string, metas: Metas) => {
  return methods
    .map((method) => {
      if (!metas[method].length) return '';

      return `
interface ${className}_${method}_paths {
  ${metas[method]
    .map((meta) => {
      return `'${meta.uri}': BaseOpenapiClient.Prettify<{
      request: {
        ${meta.query.types.length ? `query${meta.query.optional ? '?' : ''}: ${className}.${upperFirst(camelCase(meta.key + '_query'))};` : 'query?: object;'}
        ${meta.params.types.length ? `params${meta.params.optional ? '?' : ''}: ${className}.${upperFirst(camelCase(meta.key + '_params'))};` : ''}
        ${meta.body.types.length ? `body${meta.body.optional ? '?' : ''}: ${className}.${upperFirst(camelCase(meta.key + '_body'))};` : ''}
      } & BaseOpenapiClient.UserInputOpts;
      response: ${meta.response.types.length ? `${className}.${upperFirst(camelCase(meta.key + '_response'))}` : 'unknown'}
   }>`;
    })
    .join('\n')}
}`;
    })
    .join('');
};
