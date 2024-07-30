const jestTSDConfig = {
  displayName: {
    color: 'blue',
    name: 'types',
  },
  runner: 'jest-runner-tsd',
  rootDir: '../../',
  testMatch: ['**/__tests__/*.test-tsd.ts'],
};

export default jestTSDConfig;
