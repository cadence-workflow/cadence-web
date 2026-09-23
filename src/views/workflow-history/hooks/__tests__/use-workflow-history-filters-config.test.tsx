import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

jest.mock('../../config/workflow-history-filters.config', () => ({
  __esModule: true,
  default: ['base-filter-config'],
}));

jest.mock('../../config/workflow-history-filters-with-issues.config', () => ({
  __esModule: true,
  default: ['base-filter-config', 'issues-filter-config'],
}));

import workflowHistoryFiltersWithIssuesConfig from '../../config/workflow-history-filters-with-issues.config';
import workflowHistoryFiltersConfig from '../../config/workflow-history-filters.config';
import useWorkflowHistoryFiltersConfig from '../use-workflow-history-filters-config';

describe(useWorkflowHistoryFiltersConfig.name, () => {
  it('returns base filters when diagnostics in history is disabled', async () => {
    const { result, configResolver } = setup({
      isDiagnosticsInHistoryEnabled: false,
    });

    await waitFor(() => {
      expect(configResolver).toHaveBeenCalled();
    });

    expect(result.current).toBe(workflowHistoryFiltersConfig);
  });

  it('returns issue filters when diagnostics in history is enabled', async () => {
    const { result } = setup({ isDiagnosticsInHistoryEnabled: true });

    await waitFor(() => {
      expect(result.current).toBe(workflowHistoryFiltersWithIssuesConfig);
    });
  });
});

function setup({
  isDiagnosticsInHistoryEnabled,
}: {
  isDiagnosticsInHistoryEnabled: boolean;
}) {
  const configResolver = jest.fn(() =>
    HttpResponse.json(isDiagnosticsInHistoryEnabled)
  );

  const rendered = renderHook(() => useWorkflowHistoryFiltersConfig(), {
    endpointsMocks: [
      {
        path: '/api/config',
        httpMethod: 'GET',
        httpResolver: configResolver,
      },
    ],
  });

  return { ...rendered, configResolver };
}
