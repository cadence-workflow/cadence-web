import {
  ATTRIBUTES,
  LOGICAL_OPERATORS,
  TIME_FORMAT,
  STATUSES,
  BOOLEAN_VALUES,
} from '../../workflows-query-input.constants';
import getAutocompleteSuggestions from '../get-autocomplete-suggestions';

describe('getAutocompleteSuggestions', () => {
  it('suggests attributes at start', () => {
    const suggestions = getAutocompleteSuggestions('');
    expect(suggestions).toEqual(ATTRIBUTES);
  });

  it('suggests attributes for partial matches', () => {
    const suggestions = getAutocompleteSuggestions('Work');
    expect(suggestions).toContain('WorkflowType');
    expect(suggestions).toContain('WorkflowID');
  });

  it('suggests attributes after logical operator with a prompt', () => {
    const suggestionsAfterSpace = getAutocompleteSuggestions(
      'WorkflowID = "test" AND c'
    );
    expect(suggestionsAfterSpace).toEqual(['CloseTime', 'CloseStatus']);
  });

  it('suggests logical operators after a complete WorkflowID value', () => {
    const suggestions = getAutocompleteSuggestions('WorkflowID = "foo"');
    expect(suggestions).toEqual(LOGICAL_OPERATORS);
  });

  it('suggests logical operators after a complete boolean value', () => {
    const suggestionsAfterBoolean = getAutocompleteSuggestions('IsCron = TRUE');
    expect(suggestionsAfterBoolean).toEqual(LOGICAL_OPERATORS);
  });

  it('suggests time format after StartTime', () => {
    const suggestions = getAutocompleteSuggestions('StartTime >=');
    expect(suggestions).toEqual([TIME_FORMAT]);
  });

  it('suggests time format after CloseTime', () => {
    const suggestionsLessEqual = getAutocompleteSuggestions('CloseTime <=');
    expect(suggestionsLessEqual).toEqual([TIME_FORMAT]);
  });

  it('suggests time format after UpdateTime', () => {
    const suggestionsEqual = getAutocompleteSuggestions('UpdateTime =');
    expect(suggestionsEqual).toEqual([TIME_FORMAT]);
  });

  it('suggests empty quotes after WorkflowID', () => {
    const suggestionsEqual = getAutocompleteSuggestions('WorkflowID =');
    expect(suggestionsEqual).toEqual(['""']);
  });

  it('suggests empty quotes after WorkflowType', () => {
    const suggestionsNotEqual = getAutocompleteSuggestions('WorkflowType !=');
    expect(suggestionsNotEqual).toEqual(['""']);
  });

  it('suggests empty quotes after RunID', () => {
    const suggestionsRunID = getAutocompleteSuggestions('RunID =');
    expect(suggestionsRunID).toEqual(['""']);
  });

  it('suggests status values after CloseStatus', () => {
    const suggestions = getAutocompleteSuggestions('CloseStatus =');
    expect(suggestions).toEqual(STATUSES);
  });

  it('suggests boolean values after IsCron', () => {
    const suggestionsIsCron = getAutocompleteSuggestions('IsCron =');
    expect(suggestionsIsCron).toEqual(BOOLEAN_VALUES);
  });

  it('suggests boolean values after Passed', () => {
    const suggestionsPassed = getAutocompleteSuggestions('Passed !=');
    expect(suggestionsPassed).toEqual(BOOLEAN_VALUES);
  });

  it('returns empty array for unknown input', () => {
    const suggestions = getAutocompleteSuggestions('foobar');
    expect(suggestions).toEqual([]);
  });

  it('returns empty array for incomplete WorkflowID input', () => {
    const suggestionsIncomplete =
      getAutocompleteSuggestions('WorkflowID = "abc');
    expect(suggestionsIncomplete).toEqual([]);
  });

  it('handles partial attribute matching for Close attributes', () => {
    const suggestions = getAutocompleteSuggestions('Close');
    expect(suggestions).toContain('CloseStatus');
    expect(suggestions).toContain('CloseTime');
  });

  it('handles case insensitive partial attribute matching', () => {
    const suggestionsCase = getAutocompleteSuggestions('close');
    expect(suggestionsCase).toContain('CloseStatus');
    expect(suggestionsCase).toContain('CloseTime');
  });

  it('suggests logical operators after complete complex query', () => {
    const complexQuery =
      'WorkflowID = "test" AND StartTime >= "2023-01-01T00:00:00Z"';
    const suggestions = getAutocompleteSuggestions(complexQuery);
    expect(suggestions).toEqual(LOGICAL_OPERATORS);
  });

  it('suggests attributes after logical operator in complex query', () => {
    const complexQuery =
      'WorkflowID = "test" AND StartTime >= "2023-01-01T00:00:00Z" AND c';
    const suggestions = getAutocompleteSuggestions(complexQuery);
    expect(suggestions).toEqual(['CloseTime', 'CloseStatus']);
  });
});
