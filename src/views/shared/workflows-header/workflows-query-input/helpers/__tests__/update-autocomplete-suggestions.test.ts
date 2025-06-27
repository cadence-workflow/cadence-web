import type { Suggestion } from '../../workflows-query-input.types';
import { updateQueryTextWithSuggestion } from '../update-autocomplete-suggestions';

describe('updateQueryTextWithSuggestion', () => {
  it('appends suggestion if last token is operator', () => {
    const setQueryText = jest.fn();
    updateQueryTextWithSuggestion(
      { suggestion: { name: 'WorkflowId' } },
      'AND ',
      setQueryText
    );
    expect(setQueryText).toHaveBeenCalledWith('AND WorkflowId ');
  });

  it('replaces last token if not operator or complete value', () => {
    const setQueryText = jest.fn();
    updateQueryTextWithSuggestion(
      { suggestion: { name: 'WorkflowId' } },
      'Work',
      setQueryText
    );
    expect(setQueryText).toHaveBeenCalledWith('WorkflowId ');
  });

  it('appends suggestion if last token is a complete value', () => {
    const setQueryText = jest.fn();
    updateQueryTextWithSuggestion(
      { suggestion: { name: 'AND' } },
      'WorkflowId = "foo"',
      setQueryText
    );
    expect(setQueryText).toHaveBeenCalledWith('WorkflowId = "foo" AND ');
  });
});
