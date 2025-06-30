import { renderHook, act, waitFor } from '@/test-utils/rtl';

import getAutocompleteSuggestions from '../../helpers/get-autocomplete-suggestions';
import getUpdatedQueryTextWithSuggestion from '../../helpers/get-updated-query-text-with-suggestion';
import useQueryTextWithAutocomplete from '../use-query-text-with-autocomplete';

jest.mock('../../helpers/get-autocomplete-suggestions', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(['WorkflowType', 'WorkflowID']),
}));

jest.mock('../../helpers/get-updated-query-text-with-suggestion', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue('updated query text'),
}));

const mockGetAutocompleteSuggestions =
  getAutocompleteSuggestions as jest.MockedFunction<
    typeof getAutocompleteSuggestions
  >;
const mockGetUpdatedQueryTextWithSuggestion =
  getUpdatedQueryTextWithSuggestion as jest.MockedFunction<
    typeof getUpdatedQueryTextWithSuggestion
  >;

describe('useQueryTextWithAutocomplete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty string when no initialValue provided', () => {
    const { result } = setupHook('');

    expect(result.current.queryText).toBe('');
  });

  it('should initialize with provided initialValue', () => {
    const { result } = setupHook('WorkflowType = "test"');

    expect(result.current.queryText).toBe('WorkflowType = "test"');
  });

  it('should update queryText when initialValue changes', async () => {
    const { result, rerender } = setupHook('initial');

    expect(result.current.queryText).toBe('initial');

    rerender({ initialValue: 'updated' });

    await waitFor(() => expect(result.current.queryText).toBe('updated'));
  });

  it('should calculate suggestions based on current queryText', async () => {
    mockGetAutocompleteSuggestions.mockReturnValue([
      'WorkflowType',
      'WorkflowID',
      'StartTime',
    ]);
    const { result } = setupHook('Work');

    await waitFor(() => {
      expect(mockGetAutocompleteSuggestions).toHaveBeenCalledWith('Work');
      expect(result.current.nextSuggestions).toEqual([
        'WorkflowType',
        'WorkflowID',
        'StartTime',
      ]);
    });
  });

  it('should recalculate suggestions when queryText changes', () => {
    const { result } = setupHook('Work');

    expect(mockGetAutocompleteSuggestions).toHaveBeenCalledWith('Work');

    act(() => {
      result.current.setQueryText('Start');
    });

    expect(mockGetAutocompleteSuggestions).toHaveBeenCalledWith('Start');
  });

  it('should update queryText directly', async () => {
    const { result } = setupHook('initial');

    act(() => {
      result.current.setQueryText('new query');
    });

    await waitFor(() => expect(result.current.queryText).toBe('new query'));
  });

  it('should trigger suggestions recalculation when queryText is updated', () => {
    const { result } = setupHook('initial');

    act(() => {
      result.current.setQueryText('updated');
    });

    expect(mockGetAutocompleteSuggestions).toHaveBeenCalledWith('updated');
  });

  it('should update queryText using the helper function when suggestion is selected', async () => {
    const { result } = setupHook('Work');

    await waitFor(() => expect(result.current.queryText).toBe('Work'));

    act(() => {
      result.current.onSuggestionSelect('WorkflowType');
    });

    expect(mockGetUpdatedQueryTextWithSuggestion).toHaveBeenCalledWith(
      'Work',
      'WorkflowType'
    );

    await waitFor(() =>
      expect(result.current.queryText).toBe('updated query text')
    );
  });

  it('should trigger suggestions recalculation after selection', async () => {
    const { result } = setupHook('Work');

    act(() => {
      result.current.onSuggestionSelect('WorkflowType');
    });

    await waitFor(() =>
      expect(mockGetAutocompleteSuggestions).toHaveBeenCalledWith(
        'updated query text'
      )
    );
  });

  it('should handle empty string initialValue', () => {
    const { result } = setupHook('');

    expect(result.current.queryText).toBe('');
    expect(mockGetAutocompleteSuggestions).not.toHaveBeenCalled();
  });

  it('should handle whitespace-only initialValue', () => {
    const { result } = setupHook('   ');

    expect(result.current.queryText).toBe('   ');
    expect(mockGetAutocompleteSuggestions).toHaveBeenCalledWith('   ');
  });

  it('should handle complex query strings', () => {
    const complexQuery =
      'WorkflowType = "test" AND StartTime > "2023-01-01T00:00:00Z"';
    const { result } = setupHook(complexQuery);

    expect(result.current.queryText).toBe(complexQuery);
    expect(mockGetAutocompleteSuggestions).toHaveBeenCalledWith(complexQuery);
  });

  it('should return empty suggestions when helper returns empty array', () => {
    mockGetAutocompleteSuggestions.mockReturnValue([]);
    const { result } = setupHook('xyz');

    expect(result.current.nextSuggestions).toEqual([]);
  });
});

function setupHook(initialValue: string = '') {
  return renderHook(
    (props?: { initialValue: string }) =>
      useQueryTextWithAutocomplete(props || { initialValue: '' }),
    undefined,
    { initialProps: { initialValue } }
  );
}
