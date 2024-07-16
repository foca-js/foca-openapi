export const generateComments = (meta: {
  deprecated?: boolean;
  description?: string;
}) => {
  let comments: string[] = [];
  if (meta.description) {
    comments.push(`* ${meta.description}`);
  }
  if (meta.deprecated) {
    comments.push('* @deprecated');
  }
  return comments.length ? `\n/**\n${comments.join('\n')} \n*/\n` : '';
};
