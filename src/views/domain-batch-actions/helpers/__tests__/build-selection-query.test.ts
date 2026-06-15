import buildSelectionQuery from '../build-selection-query';

describe(buildSelectionQuery.name, () => {
  it('returns an empty string for no workflows', () => {
    expect(buildSelectionQuery([])).toBe('');
  });

  it('builds a single clause for one workflow', () => {
    expect(buildSelectionQuery([{ runID: 'run-1' }])).toBe('(RunID = "run-1")');
  });

  it('ORs multiple workflows together', () => {
    expect(buildSelectionQuery([{ runID: 'run-1' }, { runID: 'run-2' }])).toBe(
      '(RunID = "run-1") OR (RunID = "run-2")'
    );
  });

  it('escapes quotes and backslashes in run IDs', () => {
    expect(buildSelectionQuery([{ runID: 'run"a\\b' }])).toBe(
      '(RunID = "run\\"a\\\\b")'
    );
  });
});
