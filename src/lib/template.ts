export const pickContentTypes = `
protected override pickContentTypes(uri: string, method: string) {
  return contentTypes[method + " " + uri] || [void 0, void 0];
}
`;
