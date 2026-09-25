import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { mockWorkflowDiagnosticsResult } from '@/route-handlers/diagnose-workflow/__fixtures__/mock-workflow-diagnostics-result';

import getDiagnosticsIssuesByEventId from '../../helpers/get-diagnostics-issues-by-event-id';
import useWorkflowHistoryPageContext from '../use-workflow-history-page-context';

describe(useWorkflowHistoryPageContext.name, () => {
  it('returns disabled config and empty diagnostics when diagnostics in history is disabled', async () => {
    const { result, configResolver, diagnoseResolver } = setup({
      isDiagnosticsInHistoryEnabled: false,
    });

    await waitFor(() => {
      expect(configResolver).toHaveBeenCalled();
    });

    expect(result.current).toEqual({
      pageConfig: { WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED: false },
      diagnosticsByEventId: {},
    });
    expect(diagnoseResolver).not.toHaveBeenCalled();
  });

  it('returns diagnostics by event ID when diagnostics in history is enabled', async () => {
    const { result } = setup({ isDiagnosticsInHistoryEnabled: true });

    await waitFor(() => {
      expect(result.current).toEqual({
        pageConfig: { WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED: true },
        diagnosticsByEventId: getDiagnosticsIssuesByEventId(
          mockWorkflowDiagnosticsResult
        ),
      });
    });
  });

  it('returns empty diagnostics when the diagnostics response has a parsing error', async () => {
    const { result, diagnoseResolver } = setup({
      isDiagnosticsInHistoryEnabled: true,
      hasParsingError: true,
    });

    await waitFor(() => {
      expect(diagnoseResolver).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(result.current).toEqual({
        pageConfig: { WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED: true },
        diagnosticsByEventId: {},
      });
    });
  });
});

function setup({
  isDiagnosticsInHistoryEnabled,
  hasParsingError = false,
}: {
  isDiagnosticsInHistoryEnabled: boolean;
  hasParsingError?: boolean;
}) {
  const configResolver = jest.fn(() =>
    HttpResponse.json(isDiagnosticsInHistoryEnabled)
  );

  const diagnoseResolver = jest.fn(() =>
    HttpResponse.json(
      hasParsingError
        ? { result: {}, parsingError: { message: 'mock parsing error' } }
        : { result: mockWorkflowDiagnosticsResult, parsingError: null }
    )
  );

  const rendered = renderHook(
    () =>
      useWorkflowHistoryPageContext({
        domain: 'mock-domain',
        cluster: 'mock-cluster',
        workflowId: 'mock-workflow-id',
        runId: 'mock-run-id',
      }),
    {
      endpointsMocks: [
        {
          path: '/api/config',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: configResolver,
        },
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/diagnose',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: diagnoseResolver,
        },
      ],
    }
  );

  return { ...rendered, configResolver, diagnoseResolver };
}
