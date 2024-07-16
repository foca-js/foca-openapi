import type { OpenAPIV3 } from 'openapi-types';
import { upperFirst, camelCase } from 'lodash-es';
import { documentToMeta, type Metas } from './document-to-meta';
import { methods } from './adapter';

export const generateTemplate = (docs: OpenAPIV3.Document, projectName: string = '') => {
  projectName = upperFirst(camelCase(projectName));
  const className = `OpenapiClient${projectName}`;
  const metas = documentToMeta(docs);
  const tpl = `
    import { BaseOpenapiClient } from './base-openapi-client';

    ${generateNamespaceTpl(className, metas)}
    ${generateClassTpl(className, metas)}
    ${generateContentTypeTpl(metas)}
    ${generatePathRelationTpl(className, metas)}
`;

  return { [projectName]: tpl };
};

export const generateNamespaceTpl = (className: string, metas: Metas) => {
  return `
export namespace ${className} {
  ${methods
    .flatMap((method) => {
      let content = metas[method].flatMap((meta) => {
        let opts: string[] = [];

        (<const>['query', 'params']).forEach((key) => {
          const interfaceName = upperFirst(camelCase(meta.key + '_' + key));
          if (meta[key].types.length) {
            opts.push(`export interface ${interfaceName} ${meta[key].types[0]}\n`);
          }
        });

        (<const>['body', 'response']).forEach((key) => {
          const interfaceName = upperFirst(camelCase(meta.key + '_' + key));
          if (meta[key].types.length) {
            opts.push(
              meta[key].types.length === 1
                ? `export interface ${interfaceName} ${meta[key].types}\n`
                : `export type ${interfaceName} =  ${meta[key].types.join(' | ')}\n`,
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

export const generateClassTpl = (className: string, metas: Metas) => {
  return `
export class ${className} extends BaseOpenapiClient {
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
      ): Promise<${className}_${method}_paths[K]['response']> {
          return this.request(uri, '${method}', rest[0] || {});
      }`;
    })
    .join('\n')}
    
    protected override getContentTypes(uri: string, method: string) {
      return defaultContentTypes[uri + ' ' + method] || [void 0, void 0];
    }
}
  `;
};

export const generateContentTypeTpl = (metas: Metas) => {
  return `
  const defaultContentTypes: Record<string, [BaseOpenapiClient.UserInputOpts['requestBodyType'], BaseOpenapiClient.UserInputOpts['responseType']]> = {
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
