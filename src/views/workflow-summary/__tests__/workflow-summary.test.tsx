import React, { Suspense } from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type DescribeWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeWorkflowExecutionResponse';
import { type GetWorkflowExecutionHistoryResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/GetWorkflowExecutionHistoryResponse';
import { startWorkflowExecutionEvent } from '@/views/workflow-history/__fixtures__/workflow-history-single-events';
import { type WorkflowPageTabContentProps } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import WorkflowSummary from '../workflow-summary';

jest.mock('../workflow-summary-details/workflow-summary-details', () =>
  jest.fn(() => <div>MockWorkflowSummaryDetails</div>)
);

jest.mock('../workflow-summary-json-view/workflow-summary-json-view', () =>
  jest.fn(() => <div>MockWorkflowSummaryJsonView</div>)
);

jest.mock(
  '../workflow-summary-diagnostics-banner/workflow-summary-diagnostics-banner',
  () => jest.fn(() => <div>MockWorkflowSummaryDiagnosticsBanner</div>)
);

describe('WorkflowSummary', () => {
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
        <WorkflowSummary params={params} />
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
      await screen.findByText('MockWorkflowSummaryDetails')
    ).toBeInTheDocument();
    expect(
      await screen.findByText('MockWorkflowSummaryJsonView')
    ).toBeInTheDocument();
    expect(
      await screen.findByText('MockWorkflowSummaryDiagnosticsBanner')
    ).toBeInTheDocument();
  });
});
