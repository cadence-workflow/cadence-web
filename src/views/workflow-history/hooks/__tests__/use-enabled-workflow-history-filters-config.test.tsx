import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import workflowHistoryFiltersConfig from '../../config/workflow-history-filters.config';
import useEnabledWorkflowHistoryFiltersConfig from '../use-enabled-workflow-history-filters-config';

describe(useEnabledWorkflowHistoryFiltersConfig.name, () => {
  it('excludes the issues filter when diagnostics in history is disabled', async () => {
    const { result, configResolver } = setup({
      isDiagnosticsInHistoryEnabled: false,
    });

    await waitFor(() => {
      expect(configResolver).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(result.current).toEqual(
        workflowHistoryFiltersConfig.filter(
          (f) => f.id !== 'historyEventIssues'
        )
      );
    });
  });

  it('includes the issues filter when diagnostics in history is enabled', async () => {
    const { result, configResolver } = setup({
      isDiagnosticsInHistoryEnabled: true,
    });

    await waitFor(() => {
      expect(configResolver).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(result.current).toEqual(workflowHistoryFiltersConfig);
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

  const rendered = renderHook(() => useEnabledWorkflowHistoryFiltersConfig(), {
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
