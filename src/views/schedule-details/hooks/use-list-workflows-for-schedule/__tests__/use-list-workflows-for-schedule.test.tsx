import { HttpResponse } from 'msw';

import { act, renderHook, waitFor } from '@/test-utils/rtl';

import useListWorkflowsForSchedule from '../use-list-workflows-for-schedule';

const MOCK_DOMAIN = 'test-domain';
const MOCK_CLUSTER = 'test-cluster';

describe(useListWorkflowsForSchedule.name, () => {
  it('refetches as soon as the runs revision changes', async () => {
    const { rerender, getRequestCount } = await setup('40');

    rerender({ runsRevision: '41' });

    await waitFor(() => {
      expect(getRequestCount()).toBe(2);
    });
  });

  it('does not refetch when the runs revision first arrives', async () => {
    const { rerender, getRequestCount } = await setup(undefined);

    // The schedule description resolves after the runs are already loaded, so
    // the first revision it brings describes what is on screen.
    rerender({ runsRevision: '40' });
    await act(async () => {});

    expect(getRequestCount()).toBe(1);
  });
});

async function setup(runsRevision: string | undefined) {
  let requestCount = 0;

  const result = renderHook(
    (props?: { runsRevision?: string }) =>
      useListWorkflowsForSchedule({
        domain: MOCK_DOMAIN,
        cluster: MOCK_CLUSTER,
        scheduleId: 'my-schedule-id',
        pageSize: 5,
        runsRevision: props?.runsRevision,
      }),
    {
      endpointsMocks: [
        {
          path: `/api/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}/workflows`,
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: () => {
            requestCount += 1;
            return HttpResponse.json({ workflows: [], nextPage: '' });
          },
        },
      ],
    },
    { initialProps: { runsRevision } }
  );

  const getRequestCount = () => requestCount;

  await waitFor(() => {
    expect(getRequestCount()).toBe(1);
  });

  return { ...result, getRequestCount };
}
