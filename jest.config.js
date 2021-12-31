/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  verbose: true,
  clearMocks: true,
  coverageReporters: ['json', 'lcov', 'text-summary', 'clover'],
  cacheDirectory: '<rootDir>/tmp/cache/jest',
  restoreMocks: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./__jest__/setup-after-env.js', 'jest-canvas-mock'],
  //setupFilesAfterEnv: ['jest-canvas-mock'],
  timers: 'fake',
  testMatch: ['**/__tests__/**/*.test.js?(x)'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+.(ts|html)$': 'ts-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
  },
  moduleNameMapper: {
    '^.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
  },
  transformIgnorePatterns: ['node_modules/(?!monaco-editor)'],
};
