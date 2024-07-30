import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const esModules = ['query-string', 'decode-uri-component','split-on-first','filter-obj']

const createJestConfig = nextJest({
  dir: './',
})
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
  setupFilesAfterEnv: ["<rootDir>/jest/node/jest.setup.ts"],
  testEnvironment: "node",
  testMatch: [
    "**/__tests__/**/*.node.ts"
  ],
  transformIgnorePatterns: [`/node_modules/(?!(${esModules.join('|')})/)`],
};
 

const getCustomizedConfig= async () => {
  const jestConfig = await createJestConfig(config)();
  return {
    ...jestConfig,
    // replacing nextjs node_modules ignore patterns with a pattern that doesn't ignore es modules
    // link to discussion and fix https://github.com/vercel/next.js/issues/40183#issuecomment-1249077718
    transformIgnorePatterns: jestConfig.transformIgnorePatterns?.filter(
      (ptn) => ptn !== '/node_modules/'
    ),
  }
}
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default getCustomizedConfig
