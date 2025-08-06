import React, { Suspense } from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type DescribeWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeWorkflowExecutionResponse';
import { type GetWorkflowExecutionHistoryResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/GetWorkflowExecutionHistoryResponse';
import { startWorkflowExecutionEvent } from '@/views/workflow-history/__fixtures__/workflow-history-single-events';
import { type WorkflowPageTabContentProps } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import WorkflowSummaryTab from '../workflow-summary-tab';

jest.mock('../workflow-summary-tab-details/workflow-summary-tab-details', () =>
  jest.fn(() => <div>MockWorkflowSummaryTabDetails</div>)
);

jest.mock(
  '../workflow-summary-tab-json-view/workflow-summary-tab-json-view',
  () => jest.fn(() => <div>MockWorkflowSummaryTabJsonView</div>)
);

jest.mock(
  '../workflow-summary-tab-diagnostics-banner/workflow-summary-tab-diagnostics-banner',
  () => jest.fn(() => <div>MockWorkflowSummaryTabDiagnosticsBanner</div>)
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

  it('should render tab deatils, JSON view, and diagnostics banner', async () => {
    render(
      <Suspense>
        <WorkflowSummaryTab params={params} />
      </Suspense>,
      {
        endpointsMocks: [
          {
            path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/history',
            httpMethod: 'GET',
            jsonResponse: {
              history: {
                events: [startWorkflowExecutionEvent],
              },
              rawHistory: [],
              nextPageToken: '',
              archived: false,
            } satisfies GetWorkflowExecutionHistoryResponse,
          },
          {
            path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId',
            httpMethod: 'GET',
            jsonResponse: {
              executionConfiguration: null,
              pendingChildren: [],
              pendingActivities: [],
              pendingDecision: null,
              workflowExecutionInfo: null,
            } satisfies DescribeWorkflowExecutionResponse,
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
    expect(
      await screen.findByText('MockWorkflowSummaryTabDiagnosticsBanner')
    ).toBeInTheDocument();
  });
});
