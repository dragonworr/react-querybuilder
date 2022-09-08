import glob from 'glob';
import globToRegexp from 'glob-to-regexp';
import { writeFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import prettier from 'prettier';

const rootPrettierConfig = await prettier.resolveConfig(process.cwd());
const fileGlob = '{packages/*/src/**,packages/*/dev/**,*.js,examples/**/*}';
const prettierIgnoreGlobs = (await readFile('.prettierignore'))
  .toString('utf-8')
  .split('\n')
  .filter(Boolean);
const prettierIgnoreREs = prettierIgnoreGlobs.map(pig => globToRegexp(pig));
const prettierAllow = f => prettierIgnoreREs.every(pire => !pire.test(f));

const fileList = glob.sync(fileGlob, { nodir: true }).filter(prettierAllow);

for (const filepath of fileList) {
  const fileContents = (await readFile(filepath)).toString('utf-8');
  const prettierConfig = await prettier.resolveConfig(filepath);
  const { printWidth } = /\.s?css$/.test(filepath) ? rootPrettierConfig : prettierConfig;
  const prettierOptions = {
    ...prettierConfig,
    printWidth,
    filepath,
    plugins: ['prettier-plugin-organize-imports'],
  };

  if (!prettier.check(fileContents, prettierOptions)) {
    const prettified = prettier.format(fileContents, prettierOptions);
    setTimeout(() => {
      writeFileSync(filepath, prettified);
      console.log(`C ${filepath}`);
    });
  } else {
    setTimeout(() => console.log(`- ${filepath}`));
  }
}
