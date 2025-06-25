import type { Suggestion } from '../../workflows-query-input.types';
import {
  getAutocompleteSuggestions,
  onSuggestionSelected,
} from '../get-autocomplete-suggestions';

describe('getAutocompleteSuggestions', () => {
  it('suggests attributes at start', () => {
    const suggestions = getAutocompleteSuggestions('');
    expect(suggestions.some((s) => s.type === 'ATTRIBUTE')).toBe(true);
  });

  it('suggests attributes after logical operator', () => {
    const suggestions = getAutocompleteSuggestions('AND ');
    expect(suggestions.some((s) => s.type === 'ATTRIBUTE')).toBe(true);
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
    const suggestions = getAutocompleteSuggestions('WorkflowId =');
    expect(suggestions.some((s) => s.type === 'ID')).toBe(true);
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

describe('onSuggestionSelected', () => {
  it('appends suggestion if last token is operator', () => {
    const setQueryText = jest.fn();
    onSuggestionSelected(
      { suggestion: { name: 'WorkflowId' } },
      'AND ',
      setQueryText
    );
    expect(setQueryText).toHaveBeenCalledWith('AND WorkflowId ');
  });

  it('replaces last token if not operator or complete value', () => {
    const setQueryText = jest.fn();
    onSuggestionSelected(
      { suggestion: { name: 'WorkflowId' } },
      'Work',
      setQueryText
    );
    expect(setQueryText).toHaveBeenCalledWith('WorkflowId ');
  });

  it('appends suggestion if last token is a complete value', () => {
    const setQueryText = jest.fn();
    onSuggestionSelected(
      { suggestion: { name: 'AND' } },
      'WorkflowId = "foo"',
      setQueryText
    );
    expect(setQueryText).toHaveBeenCalledWith('WorkflowId = "foo" AND ');
  });
});
