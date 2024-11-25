const config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/test-utils',
    '\\.config\\.ts$',
  ],
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  projects: [
    '<rootDir>/jest/browser/jest.config.ts',
    '<rootDir>/jest/node/jest.config.ts',
  ],
};
export default config;
