import type { OpenAPIV3 } from 'openapi-types';
import { upperFirst, camelCase, snakeCase } from 'lodash-es';
import { documentToMeta, type Metas } from './document-to-meta';
import { methods } from './adapter';
import prettier from 'prettier';
import { generateComments } from './generate-comments';
import type { OpenapiClientConfig } from '../define-config';

export const generateTemplate = async (
  docs: OpenAPIV3.Document,
  config: Pick<OpenapiClientConfig, 'projectName' | 'classMode'>,
) => {
  const { projectName = '', classMode = 'rest' } = config;
  const className = `OpenapiClient${upperFirst(camelCase(projectName))}`;
  const metas = documentToMeta(docs);

  const classTpl =
    classMode === 'rest'
      ? generateMethodModeClass(className, metas)
      : classMode === 'rpc-group'
        ? generateUriModelClassWithGroup(className, metas)
        : generateUriModelClass(className, metas);

  const content = `
    import { BaseOpenapiClient } from 'foca-openapi';

    ${generateNamespaceTpl(className, metas)}
    ${classTpl}
    ${generatePathRelationTpl(className, metas)}
    ${generateContentTypeTpl(metas)}
`;

  return {
    [projectName]: await prettier.format(content, {
      parser: 'typescript',
      printWidth: 120,
      semi: true,
    }),
  };
};

export const generateNamespaceTpl = (className: string, metas: Metas) => {
  return `
export namespace ${className} {
  ${methods
    .flatMap((method) => {
      let content = metas[method].flatMap((meta) => {
        let opts: string[] = [];

        (<const>['query', 'params', 'body', 'response']).forEach((key) => {
          const interfaceName = upperFirst(camelCase(meta.key + '_' + key));
          if (meta[key].types.length) {
            opts.push(`export type ${interfaceName} = ${meta[key].types.join(' | ')}\n`);
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
  return `
export class ${className}<T extends object = object> extends BaseOpenapiClient<T> {
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
      const optType = `${className}_${method}_paths[K]['request'] & BaseOpenapiClient.UserInputOpts<T>`;
      if (optionalUris.length === uris.length) {
        opts = `[opts?: ${optType}]`;
      } else if (optionalUris.length === 0) {
        opts = `[opts: ${optType}]`;
      } else {
        opts = `K extends '${optionalUris.join(' | ')}' ? [opts?: ${optType}] : [opts: ${optType}]`;
      }

      return `${method}<K extends keyof ${className}_${method}_paths>(
        uri: K, ...rest: ${opts}
      ): Promise<${className}_${method}_paths[K]['response']> {
        return this.request(uri, "get", ...rest);
      }
      `;
    })
    .join('\n')}

  protected override pickContentTypes(uri: string, method: string) {
    return contentTypes[method + " " + uri] || [void 0, void 0];
  }
}`;
};

export const generateUriModelClass = (className: string, metas: Metas) => {
  return `
export class ${className}<T extends object = object> extends BaseOpenapiClient<T> {
  ${methods
    .flatMap((method) => {
      return metas[method].map((meta) => {
        const optional =
          meta.query.optional && meta.params.optional && meta.body.optional;

        return `
        ${generateComments(meta)}${camelCase(meta.key)}(opts${optional ? '?' : ''}: ${className}_${method}_paths['${meta.uri}']['request'] & BaseOpenapiClient.UserInputOpts<T>): Promise<${className}_${method}_paths['${meta.uri}']['response']> {
          return this.request('${meta.uri}', "${method}", opts);
        }
        `;
      });
    })
    .join('\n')}

    protected override pickContentTypes(uri: string, method: string) {
      return contentTypes[method + " " + uri] || [void 0, void 0];
    }
}`;
};

export const generateUriModelClassWithGroup = (className: string, metas: Metas) => {
  const namespaces = [
    ...new Set(
      methods.flatMap((method) => metas[method].flatMap((meta) => meta.tags || [])),
    ),
  ];

  return `
export class ${className}<T extends object = object> extends BaseOpenapiClient<T> {
  ${namespaces
    .map((ns) => {
      return `readonly ${snakeCase(ns)} = {
      ${methods
        .flatMap((method) => {
          return metas[method]
            .filter((meta) => meta.tags.includes(ns))
            .map((meta) => {
              const optional =
                meta.query.optional && meta.params.optional && meta.body.optional;

              return `${generateComments(meta)}${camelCase(meta.key)}(opts${optional ? '?' : ''}: ${className}_${method}_paths['${meta.uri}']['request'] & BaseOpenapiClient.UserInputOpts<T>): Promise<${className}_${method}_paths['${meta.uri}']['response']> {
                return this.request('${meta.uri}', '${method}', opts);
              }`;
            });
        })
        .join(',\n')}
    }`;
    })
    .join('\n')}

    protected override pickContentTypes(uri: string, method: string) {
      return contentTypes[method + " " + uri] || [void 0, void 0];
    }
}`;
};

export const generateContentTypeTpl = (metas: Metas) => {
  return `
  const contentTypes: Record<string, [BaseOpenapiClient.UserInputOpts['requestBodyType'],
    BaseOpenapiClient.UserInputOpts['responseType']]> = {
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
      };
      response: ${meta.response.types.length ? `${className}.${upperFirst(camelCase(meta.key + '_response'))}` : 'unknown'}
   }>`;
    })
    .join('\n')}
}`;
    })
    .join('');
};
