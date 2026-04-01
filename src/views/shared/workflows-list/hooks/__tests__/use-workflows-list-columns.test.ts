import { HttpResponse } from 'msw';

import { renderHook, act, waitFor } from '@/test-utils/rtl';

import { type IndexedValueType } from '@/__generated__/proto-ts/uber/cadence/api/v1/IndexedValueType';
import { type GetSearchAttributesResponse } from '@/route-handlers/get-search-attributes/get-search-attributes.types';

import { DEFAULT_WORKFLOWS_LIST_COLUMNS } from '../../workflows-list.constants';
import useWorkflowsListColumns from '../use-workflows-list-columns';

const MOCK_SEARCH_ATTRIBUTES_KEYS: Record<string, IndexedValueType> = {
  WorkflowID: 'INDEXED_VALUE_TYPE_KEYWORD',
  RunID: 'INDEXED_VALUE_TYPE_KEYWORD',
  WorkflowType: 'INDEXED_VALUE_TYPE_KEYWORD',
  StartTime: 'INDEXED_VALUE_TYPE_DATETIME',
  CloseTime: 'INDEXED_VALUE_TYPE_DATETIME',
  CloseStatus: 'INDEXED_VALUE_TYPE_INT',
  DomainID: 'INDEXED_VALUE_TYPE_KEYWORD',
  HistoryLength: 'INDEXED_VALUE_TYPE_INT',
  TaskList: 'INDEXED_VALUE_TYPE_KEYWORD',
  IsCron: 'INDEXED_VALUE_TYPE_BOOL',
  ExecutionTime: 'INDEXED_VALUE_TYPE_DATETIME',
  UpdateTime: 'INDEXED_VALUE_TYPE_DATETIME',
};

const MOCK_CUSTOM_SEARCH_ATTRIBUTES_KEYS: Record<string, IndexedValueType> = {
  ...MOCK_SEARCH_ATTRIBUTES_KEYS,
  CustomKeyword: 'INDEXED_VALUE_TYPE_KEYWORD',
  CustomDate: 'INDEXED_VALUE_TYPE_DATETIME',
};

describe(useWorkflowsListColumns.name, () => {
  it('returns empty availableColumns when the API returns an error', async () => {
    const { result } = setup({ apiError: true });

    await waitFor(() => {
      expect(result.current.availableColumns).toEqual([]);
    });
  });

  it('returns empty availableColumns when there are no search attribute keys', async () => {
    const { result } = setup({ keys: {} });

    await waitFor(() => {
      expect(result.current.availableColumns).toEqual([]);
    });
  });

  it('returns columns for system attributes that have matchers', async () => {
    const { result } = setup({ keys: MOCK_SEARCH_ATTRIBUTES_KEYS });

    await waitFor(() => {
      const columnIds = result.current.availableColumns.map((c) => c.id);
      expect(columnIds).toContain('WorkflowID');
      expect(columnIds).toContain('CloseStatus');
      expect(columnIds).toContain('RunID');
      expect(columnIds).toContain('WorkflowType');
      expect(columnIds).toContain('StartTime');
      expect(columnIds).toContain('CloseTime');
    });
  });

  it('places system attributes before custom attributes', async () => {
    const { result } = setup({
      keys: MOCK_CUSTOM_SEARCH_ATTRIBUTES_KEYS,
    });

    await waitFor(() => {
      expect(result.current.availableColumns.length).toBeGreaterThan(0);
    });

    const columnIds = result.current.availableColumns.map((c) => c.id);
    const lastSystemIndex = Math.max(
      ...['WorkflowID', 'CloseStatus', 'RunID', 'StartTime', 'CloseTime']
        .map((id) => columnIds.indexOf(id))
        .filter((i) => i >= 0)
    );
    const firstCustomIndex = Math.min(
      ...['CustomKeyword', 'CustomDate']
        .map((id) => columnIds.indexOf(id))
        .filter((i) => i >= 0)
    );

    expect(lastSystemIndex).toBeLessThan(firstCustomIndex);
  });

  it('includes custom attributes with star-prefixed names', async () => {
    const { result } = setup({
      keys: MOCK_CUSTOM_SEARCH_ATTRIBUTES_KEYS,
    });

    await waitFor(() => {
      expect(result.current.availableColumns.length).toBeGreaterThan(0);
    });

    const customKeyword = result.current.availableColumns.find(
      (c) => c.id === 'CustomKeyword'
    );
    expect(customKeyword).toBeDefined();
    expect(customKeyword?.name).toBe('*CustomKeyword');
    expect(customKeyword?.isDefault).toBe(false);
  });

  it('returns visible columns matching the default selection', async () => {
    const { result } = setup({
      keys: MOCK_CUSTOM_SEARCH_ATTRIBUTES_KEYS,
    });

    await waitFor(() => {
      const visibleIds = result.current.visibleColumns.map((c) => c.id);
      expect(visibleIds).toEqual([...DEFAULT_WORKFLOWS_LIST_COLUMNS]);
    });
  });

  it('preserves visible columns selection order', async () => {
    const { result } = setup({ keys: MOCK_SEARCH_ATTRIBUTES_KEYS });

    await waitFor(() => {
      const visibleIds = result.current.visibleColumns.map((c) => c.id);
      expect(visibleIds).toEqual([
        'WorkflowID',
        'CloseStatus',
        'RunID',
        'WorkflowType',
        'StartTime',
        'CloseTime',
      ]);
    });
  });

  it('filters out selected IDs that are not in available columns', async () => {
    const { result } = setup({ keys: MOCK_SEARCH_ATTRIBUTES_KEYS });

    await waitFor(() => {
      expect(result.current.availableColumns.length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.setSelectedColumnIds(['WorkflowID', 'NonExistentColumn']);
    });

    const visibleIds = result.current.visibleColumns.map((c) => c.id);
    expect(visibleIds).toEqual(['WorkflowID']);
  });

  it('initializes selectedColumnIds with defaults', async () => {
    const { result } = setup({ keys: MOCK_SEARCH_ATTRIBUTES_KEYS });

    await waitFor(() => {
      expect(result.current.selectedColumnIds).toEqual([
        ...DEFAULT_WORKFLOWS_LIST_COLUMNS,
      ]);
    });
  });

  it('updates visible columns when setSelectedColumnIds is called', async () => {
    const { result } = setup({
      keys: MOCK_CUSTOM_SEARCH_ATTRIBUTES_KEYS,
    });

    await waitFor(() => {
      expect(result.current.availableColumns.length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.setSelectedColumnIds(['WorkflowID', 'CustomKeyword']);
    });

    expect(result.current.selectedColumnIds).toEqual([
      'WorkflowID',
      'CustomKeyword',
    ]);
    const visibleIds = result.current.visibleColumns.map((c) => c.id);
    expect(visibleIds).toEqual(['WorkflowID', 'CustomKeyword']);
  });

  it('restores selected columns to defaults when resetColumns is called', async () => {
    const { result } = setup({
      keys: MOCK_CUSTOM_SEARCH_ATTRIBUTES_KEYS,
    });

    await waitFor(() => {
      expect(result.current.availableColumns.length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.setSelectedColumnIds(['WorkflowID']);
    });

    expect(result.current.selectedColumnIds).toEqual(['WorkflowID']);

    act(() => {
      result.current.resetColumns();
    });

    expect(result.current.selectedColumnIds).toEqual([
      ...DEFAULT_WORKFLOWS_LIST_COLUMNS,
    ]);
  });
});

function setup({
  keys,
  apiError = false,
}: {
  keys?: Record<string, IndexedValueType>;
  apiError?: boolean;
} = {}) {
  return renderHook(
    () => useWorkflowsListColumns({ cluster: 'test-cluster' }),
    {
      endpointsMocks: [
        {
          path: '/api/clusters/:cluster/search-attributes',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            if (apiError) {
              return HttpResponse.json(
                { message: 'Failed to fetch search attributes' },
                { status: 500 }
              );
            }
            return HttpResponse.json({
              keys: keys ?? {},
            } satisfies GetSearchAttributesResponse);
          },
        },
      ],
    }
  );
}
