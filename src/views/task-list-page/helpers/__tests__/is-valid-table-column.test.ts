import isValidTableColumn from '../is-valid-table-column';

describe(isValidTableColumn.name, () => {
  const tests: Array<{
    name: string;
    columnName: string;
    expected: boolean;
  }> = [
    {
      name: 'returns true for a column that is present in config',
      columnName: 'lastAccessTime',
      expected: true,
    },
    {
      name: 'returns false for a column that is not present in config',
      columnName: 'totallyLegitColumnName',
      expected: false,
    },
  ];

  tests.forEach((test) => {
    it(test.name, () => {
      expect(isValidTableColumn(test.columnName)).toEqual(test.expected);
    });
  });
});
