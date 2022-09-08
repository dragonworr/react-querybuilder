/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  displayName: 'chakra',
  coveragePathIgnorePatterns: ['genericTests', 'dist', '(cel|sql)Parser.js'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['../../jestSetup.ts'],
  globals: { __RQB_DEV__: true },
};
