import React, { Suspense } from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type WorkflowPageTabContentProps } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import WorkflowSummaryTab from '../workflow-summary-tab';

jest.mock('../workflow-summary-tab-details/workflow-summary-tab-details', () =>
  jest.fn(() => <div>MockWorkflowSummaryTabDetails</div>)
);
jest.mock(
  '../workflow-summary-tab-json-view/workflow-summary-tab-json-view',
  () => jest.fn(() => <div>MockWorkflowSummaryTabJsonView</div>)
);

describe('WorkflowSummaryTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const params: WorkflowPageTabContentProps['params'] = {
    cluster: 'testCluster',
    domain: 'testDomain',
    workflowId: 'testWorkflowId',
    runId: 'testRunId',
    workflowTab: 'summary',
  };

  it('should render WorkflowSummaryTabDetails and WorkflowSummaryTabJsonView', async () => {
    render(
      <Suspense>
        <WorkflowSummaryTab params={params} />
      </Suspense>,
      {
        endpointsMocks: [
          {
            path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/history',
            httpMethod: 'GET',
            //TODO: @assem.hafez Provide more realistic mock
            jsonResponse: {
              history: {
                events: [
                  {
                    eventId: '13',
                    attributes: 'workflowExecutionStartedEventAttributes',
                    startAttributes: { input: 'startInput' },
                    workflowExecutionStartedEventAttributes: {},
                  },
                  {
                    eventId: '2',
                    attributes: 'workflowExecutionCompletedEventAttributes',
                    lastAttributes: { result: 'lastResult' },
                    workflowExecutionCompletedEventAttributes: {},
                  },
                ],
              },
            },
          },
        ],
      }
    );
    expect(
      await screen.findByText('MockWorkflowSummaryTabDetails')
    ).toBeInTheDocument();
    expect(
      await screen.findByText('MockWorkflowSummaryTabJsonView')
    ).toBeInTheDocument();
  });
});
