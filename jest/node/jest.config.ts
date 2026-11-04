import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});
const config: Config = {
  displayName: {
    color: 'cyan',
    name: 'node',
  },
  clearMocks: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  rootDir: '../../',
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest/node/jest.setup.ts'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.node.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/test-utils',
    '/__fixtures__/',
    '\\.config\\.ts$',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
