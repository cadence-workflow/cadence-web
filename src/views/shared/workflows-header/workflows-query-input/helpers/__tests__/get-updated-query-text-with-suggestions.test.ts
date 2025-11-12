import getUpdatedQueryTextWithSuggestion from '../get-updated-query-text-with-suggestion';

describe('getUpdatedQueryTextWithSuggestion', () => {
  it('appends suggestion after operator', () => {
    const result = getUpdatedQueryTextWithSuggestion(
      'WorkflowID =',
      'WorkflowType'
    );
    expect(result).toBe('WorkflowID = WorkflowType ');
  });

  it('appends suggestion after AND operator', () => {
    const result = getUpdatedQueryTextWithSuggestion(
      'WorkflowID = "test" AND',
      'WorkflowType'
    );
    expect(result).toBe('WorkflowID = "test" AND WorkflowType ');
  });

  it('appends suggestion after complete string value', () => {
    const result = getUpdatedQueryTextWithSuggestion(
      'WorkflowID = "foo"',
      'AND'
    );
    expect(result).toBe('WorkflowID = "foo" AND ');
  });

  it('appends suggestion after boolean value "true"', () => {
    const result = getUpdatedQueryTextWithSuggestion('IsCron = "true" ', 'AND');
    expect(result).toBe('IsCron = "true" AND ');
  });

  it('appends suggestion after boolean value "false"', () => {
    const result = getUpdatedQueryTextWithSuggestion('IsCron = "false"', 'AND');
    expect(result).toBe('IsCron = "false" AND ');
  });

  it('appends suggestion after BETWEEN operator', () => {
    const result = getUpdatedQueryTextWithSuggestion(
      'StartTime BETWEEN',
      '"2023-01-01"'
    );
    expect(result).toBe('StartTime BETWEEN "2023-01-01" ');
  });

  it('appends suggestion after comparison operators', () => {
    const result = getUpdatedQueryTextWithSuggestion(
      'StartTime >',
      '"2023-01-01"'
    );
    expect(result).toBe('StartTime > "2023-01-01" ');
  });

  it('replaces partial token with suggestion', () => {
    const result = getUpdatedQueryTextWithSuggestion('Work', 'WorkflowID');
    expect(result).toBe('WorkflowID ');
  });

  it('replaces partial token in multi-token query', () => {
    const result = getUpdatedQueryTextWithSuggestion(
      'WorkflowID = "test" AND Work',
      'WorkflowType'
    );
    expect(result).toBe('WorkflowID = "test" AND WorkflowType ');
  });

  it('replaces last token when it is not a complete value', () => {
    const result = getUpdatedQueryTextWithSuggestion(
      'WorkflowID = partial',
      '"complete-value"'
    );
    expect(result).toBe('WorkflowID = "complete-value" ');
  });

  it('handles empty query text', () => {
    const result = getUpdatedQueryTextWithSuggestion('', 'WorkflowID');
    expect(result).toBe('WorkflowID ');
  });

  it('handles single space query text', () => {
    const result = getUpdatedQueryTextWithSuggestion(' ', 'WorkflowID');
    expect(result).toBe('WorkflowID ');
  });

  it('handles query with trailing spaces', () => {
    const result = getUpdatedQueryTextWithSuggestion(
      'WorkflowID = "test"   ',
      'AND'
    );
    expect(result).toBe('WorkflowID = "test" AND ');
  });

  it('handles incomplete quoted string', () => {
    const result = getUpdatedQueryTextWithSuggestion(
      'WorkflowID = "incomplete',
      '"complete"'
    );
    expect(result).toBe('WorkflowID = "complete" ');
  });

  it('preserves case sensitivity for operators', () => {
    const result = getUpdatedQueryTextWithSuggestion(
      'WorkflowID = "test" and',
      'WorkflowType'
    );
    expect(result).toBe('WorkflowID = "test" and WorkflowType ');
  });
});
