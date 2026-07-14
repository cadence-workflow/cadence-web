import { renderHook, waitFor } from '@/test-utils/rtl';

import { startWorkflowExecutionEvent } from '@/views/workflow-history/__fixtures__/workflow-history-single-events';

import useWorkflowStartedEvent from '../use-workflow-started-event';

describe('useWorkflowStartedEvent', () => {
  it('returns the formatted started event with decoded payload fields', async () => {
    const { result } = setup({
      events: [startWorkflowExecutionEvent],
    });

    await waitFor(() => {
      expect(result.current.startedEvent).toBeDefined();
    });

    expect(result.current.startedEvent?.workflowType?.name).toBe(
      'workflow.cron'
    );
    // header payloads are base64-decoded by formatWorkflowHistory
    expect(result.current.startedEvent?.header?.fields).toEqual({
      'test-header': 'test-header-data',
    });
  });

  it('returns undefined when the first event is not a started event', async () => {
    const { result } = setup({ events: [] });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.startedEvent).toBeUndefined();
  });
});

function setup({ events }: { events: unknown[] }) {
  return renderHook(
    () =>
      useWorkflowStartedEvent({
        domain: 'test-domain',
        cluster: 'test-cluster',
        workflowId: 'test-workflow-id',
        runId: 'test-run-id',
      }),
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/history',
          httpMethod: 'GET' as const,
          jsonResponse: { history: { events } },
        },
      ],
    }
  );
}
