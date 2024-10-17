import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen } from '@/test-utils/rtl';

import { describeWorkflowResponse } from '../../__fixtures__/describe-workflow-response';
import WorkflowPagePendingEventsBadge from '../workflow-page-pending-events-badge';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: () => ({
    cluster: 'testCluster',
    domain: 'testDomain',
    workflowId: 'testWorkflowId',
    runId: 'testRunId',
    workflowTab: 'summary',
  }),
}));

describe(WorkflowPagePendingEventsBadge.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render pending activities count', async () => {
    setup({});

    expect(await screen.findByText('2 pending')).toBeInTheDocument();
  });

  it('should render nothing if the endpoint errors out', async () => {
    const { container } = setup({ isError: true });

    expect(container.firstChild).toBeEmptyDOMElement();
  });
});

function setup({ isError }: { isError?: boolean }) {
  return render(
    <Suspense>
      <WorkflowPagePendingEventsBadge />
    </Suspense>,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId',
          httpMethod: 'GET',
          ...(isError
            ? {
                httpResolver: () => {
                  return HttpResponse.json(
                    { message: 'Failed to fetch workflow summary' },
                    { status: 500 }
                  );
                },
              }
            : {
                jsonResponse: describeWorkflowResponse,
              }),
        },
      ],
    }
  );
}
