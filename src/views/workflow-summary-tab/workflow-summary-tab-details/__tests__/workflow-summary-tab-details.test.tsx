import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import formatWorkflowHistoryEvent from '@/utils/data-formatters/format-workflow-history-event';
import { type FormattedHistoryEventForType } from '@/utils/data-formatters/schema/format-history-event-schema';
import {
  completeWorkflowExecutionEvent,
  startWorkflowExecutionEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-single-events';

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

const params: Props['decodedPageUrlParams'] = {
  cluster: 'testCluster',
  domain: 'testDomain',
  workflowId: 'testWorkflowId',
  runId: 'testRunId',
  workflowTab: 'summary',
};

describe('WorkflowSummaryTabDetails', () => {
  // TODO @assem.hafez enhance typing for formattedFirstHistoryEvent
  //@ts-expect-error - TS is complaining about the type of formattedFirstHistoryEvent
  const formattedFirstHistoryEvent: FormattedHistoryEventForType<'WorkflowExecutionStarted'> =
    formatWorkflowHistoryEvent(startWorkflowExecutionEvent);
  const formattedCloseHistoryEvent = formatWorkflowHistoryEvent(
    completeWorkflowExecutionEvent
  );
  it('should render workflow type name from firstHistoryEvent', () => {
    render(
      <WorkflowSummaryTabDetails
        firstHistoryEvent={startWorkflowExecutionEvent}
        lastHistoryEvent={completeWorkflowExecutionEvent}
        formattedFirstHistoryEvent={formattedFirstHistoryEvent}
        formattedCloseHistoryEvent={formattedCloseHistoryEvent}
        decodedPageUrlParams={params}
      />
    );

    expect(screen.getByText(/Workflow:/)).toBeInTheDocument();
    expect(screen.getByText('workflow.cron')).toBeInTheDocument();
  });

  it('should render all detail rows that are not hidden', () => {
    render(
      <WorkflowSummaryTabDetails
        firstHistoryEvent={startWorkflowExecutionEvent}
        lastHistoryEvent={completeWorkflowExecutionEvent}
        formattedFirstHistoryEvent={formattedFirstHistoryEvent}
        formattedCloseHistoryEvent={formattedCloseHistoryEvent}
        decodedPageUrlParams={params}
      />
    );

    expect(screen.getByText('Test Label 1')).toBeInTheDocument();
    expect(screen.getByText('Test Value 1')).toBeInTheDocument();
    expect(screen.getByText('Test Label 2')).toBeInTheDocument();
    expect(screen.getByText('Test Value 2')).toBeInTheDocument();
  });

  it('should not render detail rows that are hidden', () => {
    render(
      <WorkflowSummaryTabDetails
        firstHistoryEvent={startWorkflowExecutionEvent}
        lastHistoryEvent={completeWorkflowExecutionEvent}
        formattedFirstHistoryEvent={formattedFirstHistoryEvent}
        formattedCloseHistoryEvent={formattedCloseHistoryEvent}
        decodedPageUrlParams={params}
      />
    );

    expect(screen.queryByText('Hidden Label 3')).not.toBeInTheDocument();
    expect(screen.queryByText('Hidden Value 3')).not.toBeInTheDocument();
  });
});
