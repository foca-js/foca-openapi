import type { OpenAPIV3 } from 'openapi-types';
import { upperFirst, camelCase, snakeCase } from 'lodash-es';
import { documentToMeta, type Metas } from './document-to-meta';
import { methods } from './adapter';
import prettier from 'prettier';
import { generateComments } from './generate-comments';
import type { OpenapiClientConfig } from '../define-config';

export const generateTemplate = async (
  docs: OpenAPIV3.Document,
  config: Pick<OpenapiClientConfig, 'projectName' | 'classMode' | 'tagToGroup'>,
) => {
  const { projectName, classMode = 'method', tagToGroup = true } = config;
  const className = `OpenapiClient${upperFirst(camelCase(projectName))}`;
  const metas = documentToMeta(docs);

  const classTpl =
    classMode === 'method'
      ? generateMethodModeClass(className, metas)
      : tagToGroup
        ? generateUriModelClassWithNamespace(className, metas)
        : generateUriModelClass(className, metas);

  const dts = `
    ${generateNamespaceTpl(className, metas)}
    ${classTpl.dts}
    ${generatePathRelationTpl(className, metas)}
`;

  const js = `
  ${classTpl.js}
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

export const generateMethodModeClass = (className: string, metas: Metas) => {
  return {
    dts: `
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
}`,
    js: `
var ${className} = class extends BaseOpenapiClient {
  ${methods
    .map((method) => {
      if (!metas[method].length) return '';
      return `${method}(uri, opts) {
        return this.request(uri, "get", opts);
      }`;
    })
    .join('\n')}

  getContentTypes(uri, method) {
    return contentTypes${className}[method + " " + uri] || [void 0, void 0];
  }
};`,
  };
};

export const generateUriModelClass = (className: string, metas: Metas) => {
  return {
    dts: `
declare class ${className} extends BaseOpenapiClient {
  ${methods
    .flatMap((method) => {
      return metas[method].map((meta) => {
        const optional =
          meta.query.optional && meta.params.optional && meta.body.optional;

        return `
        ${generateComments(meta)}
        ${camelCase(meta.key)}(opts${optional ? '?' : ''}: ${className}_${method}_paths['${meta.uri}']['request']): Promise<${className}_${method}_paths['${meta.uri}']['response']>`;
      });
    })
    .join('\n')}

  protected getContentTypes(uri: string, method: string) : [
    BaseOpenapiClient.UserInputOpts['requestBodyType'],
    BaseOpenapiClient.UserInputOpts['responseType'],
  ];
}`,
    js: `
var ${className} = class extends BaseOpenapiClient {
  ${methods
    .flatMap((method) => {
      return metas[method].map((meta) => {
        return `
        ${camelCase(meta.key)}(opts) {
          return this.request('${meta.uri}', "${method}", opts);
        }`;
      });
    })
    .join('\n')}

  getContentTypes(uri, method) {
    return contentTypes${className}[method + " " + uri] || [void 0, void 0];
  }
};`,
  };
};

export const generateUriModelClassWithNamespace = (className: string, metas: Metas) => {
  const namespaces = [
    ...new Set(
      methods.flatMap((method) => metas[method].flatMap((meta) => meta.tags || [])),
    ),
  ];

  return {
    dts: `
declare class ${className} extends BaseOpenapiClient {
  ${namespaces
    .map((ns) => {
      return `readonly ${snakeCase(ns)}: {
      ${methods
        .flatMap((method) => {
          return metas[method]
            .filter((meta) => meta.tags.includes(ns))
            .map((meta) => {
              const optional =
                meta.query.optional && meta.params.optional && meta.body.optional;

              return `
              ${generateComments(meta)}
              ${camelCase(meta.key)}(opts${optional ? '?' : ''}: ${className}_${method}_paths['${meta.uri}']['request']): Promise<${className}_${method}_paths['${meta.uri}']['response']>`;
            });
        })
        .join('\n')}
    }`;
    })
    .join('\n')}

  protected getContentTypes(uri: string, method: string) : [
    BaseOpenapiClient.UserInputOpts['requestBodyType'],
    BaseOpenapiClient.UserInputOpts['responseType'],
  ];
}`,
    js: `
var ${className} = class extends BaseOpenapiClient {
  ${namespaces
    .map((ns) => {
      return `${snakeCase(ns)} = {
      ${methods
        .flatMap((method) => {
          return metas[method]
            .filter((meta) => meta.tags.includes(ns))
            .map((meta) => {
              return `${camelCase(meta.key)}(opts) {
                return this.request('${meta.uri}', '${method}', opts);
              },`;
            });
        })
        .join('\n')}
      }`;
    })
    .join('\n')}

  getContentTypes(uri, method) {
    return contentTypes${className}[method + ' ' + uri] || [void 0, void 0];
  }
};`,
  };
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
