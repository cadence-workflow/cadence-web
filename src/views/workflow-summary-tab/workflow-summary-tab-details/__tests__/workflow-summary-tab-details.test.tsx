import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import WorkflowSummaryTabDetails from '../workflow-summary-tab-details';
import {
  type WorkflowSummaryTabDetailsConfig,
  type Props,
} from '../workflow-summary-tab-details.types';

jest.mock(
  '../../config/workflow-summary-tab-details.config',
  () =>
    [
      {
        key: 'testKey1',
        getLabel: () => 'Test Label 1',
        valueComponent: () => <span>Test Value 1</span>,
      },
      {
        key: 'testKey2',
        hide: () => false,
        getLabel: () => 'Test Label 2',
        valueComponent: () => <span>Test Value 2</span>,
      },
      {
        key: 'testKey3',
        hide: () => true,
        getLabel: () => 'Hidden Label 3',
        valueComponent: () => <span>Hidden Value 3</span>,
      },
    ] satisfies WorkflowSummaryTabDetailsConfig[]
);

const params: Props['params'] = {
  cluster: 'testCluster',
  domain: 'testDomain',
  workflowId: 'testWorkflowId',
  runId: 'testRunId',
  workflowTab: 'summary',
};

describe('WorkflowSummaryTabDetails', () => {
  it('should render workflow type name from firstHistoryEvent', () => {
    const firstHistoryEvent = {
      workflowExecutionStartedEventAttributes: {
        workflowType: {
          name: 'TestWorkflowType',
        },
      },
    };
    const lastHistoryEvent = {};

    render(
      <WorkflowSummaryTabDetails
        firstHistoryEvent={firstHistoryEvent}
        lastHistoryEvent={lastHistoryEvent}
        params={params}
      />
    );

    expect(screen.getByText(/Workflow:/)).toBeInTheDocument();
    expect(screen.getByText('TestWorkflowType')).toBeInTheDocument();
  });

  it('should render all detail rows that are not hidden', () => {
    const firstHistoryEvent = {};
    const lastHistoryEvent = {};

    render(
      <WorkflowSummaryTabDetails
        firstHistoryEvent={firstHistoryEvent}
        lastHistoryEvent={lastHistoryEvent}
        params={params}
      />
    );

    expect(screen.getByText('Test Label 1')).toBeInTheDocument();
    expect(screen.getByText('Test Value 1')).toBeInTheDocument();
    expect(screen.getByText('Test Label 2')).toBeInTheDocument();
    expect(screen.getByText('Test Value 2')).toBeInTheDocument();
  });

  it('should not render detail rows that are hidden', () => {
    const firstHistoryEvent = {};
    const lastHistoryEvent = {};

    render(
      <WorkflowSummaryTabDetails
        firstHistoryEvent={firstHistoryEvent}
        lastHistoryEvent={lastHistoryEvent}
        params={params}
      />
    );

    expect(screen.queryByText('Hidden Label 3')).not.toBeInTheDocument();
    expect(screen.queryByText('Hidden Value 3')).not.toBeInTheDocument();
  });
});
