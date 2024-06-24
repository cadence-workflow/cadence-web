import React from 'react';

import { render, screen } from '@testing-library/react';

import { type WorkflowPageTabContentProps } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import WorkflowSummaryTab from '../workflow-summary-tab';

jest.mock('@/utils/request');
jest.mock('../workflow-summary-tab-details/workflow-summary-tab-details', () =>
  jest.fn(() => <div>MockWorkflowSummaryTabDetails</div>)
);
jest.mock(
  '../workflow-summary-tab-json-view/workflow-summary-tab-json-view',
  () => jest.fn(() => <div>MockWorkflowSummaryTabJsonView</div>)
);

//TODO: @assem.hafez mock useSuspenseQuery in a better way by mocking the endpoint response
jest.mock('@tanstack/react-query', () => ({
  useSuspenseQuery: () => ({
    data: {
      history: {
        events: [
          {
            eventId: '1',
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
  }),
}));

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
    render(<WorkflowSummaryTab params={params} />);

    expect(
      screen.getByText('MockWorkflowSummaryTabDetails')
    ).toBeInTheDocument();
    expect(
      screen.getByText('MockWorkflowSummaryTabJsonView')
    ).toBeInTheDocument();
  });
});
