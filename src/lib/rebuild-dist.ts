import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const rebuildDist = async (
  root: string,
  jsContent: string,
  dtsContent: string,
  classNames: string[],
) => {
  const distDir = path.join(root, 'dist');
  const backupDir = path.join(root, 'backup');

  {
    let backupDTS = await readFile(path.join(backupDir, 'index.d.ts'), 'utf8');
    backupDTS += `\n${dtsContent}\nexport { ${classNames.join(', ')} };`;
    await writeFile(path.join(distDir, 'index.d.ts'), backupDTS);
  }

  {
    let backupCJS = await readFile(path.join(backupDir, 'index.js'), 'utf8');
    backupCJS = backupCJS.replace(
      '0 && (module.exports = {',
      `${jsContent}\n0 && (module.exports = {\n${classNames.join(',')},`,
    );
    backupCJS = backupCJS.replace(
      /(__export\(.+?_exports, {)/,
      `$1\n${classNames.map((className) => `${className}: () => ${className},`)}`,
    );
    await writeFile(path.join(distDir, 'index.js'), backupCJS);
  }

  {
    let backupESM = await readFile(path.join(backupDir, 'esm', 'index.js'), 'utf8');
    backupESM += `\n${jsContent}\nexport { ${classNames.join(', ')} };`;
    await writeFile(path.join(distDir, 'esm', 'index.js'), backupESM);
  }
};
