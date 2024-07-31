export const generateComments = (opts: {
  deprecated?: boolean;
  description?: string;
  uri?: string;
  method?: string;
}) => {
  let comments: string[] = [];
  if (opts.description) comments.push(`* ${opts.description}`);
  if (opts.uri) comments.push(` * @uri ${opts.uri}`);
  if (opts.method) comments.push(` * @method ${opts.method.toUpperCase()}`);
  if (opts.deprecated) comments.push('* @deprecated');

  return comments.length ? `\n/**\n${comments.join('\n')}\n*/\n` : '';
};
