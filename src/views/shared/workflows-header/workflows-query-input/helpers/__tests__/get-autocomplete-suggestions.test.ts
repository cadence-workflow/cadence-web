import type { Suggestion } from '../../workflows-query-input.types';
import { getAutocompleteSuggestions } from '../get-autocomplete-suggestions';

describe('getAutocompleteSuggestions', () => {
  it('suggests attributes at start', () => {
    const suggestions = getAutocompleteSuggestions('');
    expect(suggestions.some((s) => s.type === 'ATTRIBUTE')).toBe(true);
  });

  it('suggests attributes after logical operator', () => {
    const suggestions = getAutocompleteSuggestions('AND');
    expect(suggestions.some((s) => s.type === 'ATTRIBUTE')).toBe(false);
    const suggestionsAfterSpace = getAutocompleteSuggestions('AND ');
    expect(suggestionsAfterSpace.some((s) => s.type === 'ATTRIBUTE')).toBe(
      false
    );
  });

  it('suggests operators after a complete value', () => {
    const suggestions = getAutocompleteSuggestions('WorkflowId = "foo"');
    expect(suggestions.some((s) => s.type === 'OPERATOR')).toBe(true);
  });

  it('suggests time format after time attribute and comparison operator', () => {
    const suggestions = getAutocompleteSuggestions('StartTime >=');
    expect(suggestions.some((s) => s.type === 'TIME')).toBe(true);
  });

  it('suggests time format between after time attribute and BETWEEN', () => {
    const suggestions = getAutocompleteSuggestions('StartTime BETWEEN');
    expect(suggestions.some((s) => s.type === 'TIME')).toBe(true);
  });

  it('suggests id value after id attribute and equality operator', () => {
    const suggestionsEqual = getAutocompleteSuggestions('WorkflowId =');
    expect(suggestionsEqual.some((s) => s.type === 'ID')).toBe(false);
    const suggestionsNotEqual = getAutocompleteSuggestions('WorkflowId !=');
    expect(suggestionsNotEqual.some((s) => s.type === 'ID')).toBe(false);
  });

  it('suggests status after CloseStatus attribute and operator', () => {
    const suggestions = getAutocompleteSuggestions('CloseStatus =');
    expect(suggestions.some((s) => s.type === 'STATUS')).toBe(true);
  });

  it('returns empty array for unknown input', () => {
    const suggestions = getAutocompleteSuggestions('foobar');
    expect(suggestions.length).toBe(0);
  });
});
