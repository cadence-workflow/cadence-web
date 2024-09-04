const snapshotExtension = '.snapshot';

module.exports = {
  resolveSnapshotPath: (testPath) =>
    testPath + snapshotExtension,

  resolveTestPath: (snapshotFilePath) =>
    snapshotFilePath.slice(0, -snapshotExtension.length),

  // Example test path, used for preflight consistency check of the implementation above
  testPathForConsistencyCheck: 'views/component/__tests__/component.test.js',
};
