import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';
import formatWorkflowHistoryEvent from '@/utils/data-formatters/format-workflow-history-event';
import {
  completeWorkflowExecutionEvent,
  startWorkflowExecutionEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-single-events';

import { mockFormattedFirstEvent } from '../../__fixtures__/formatted-first-history-event';
import WorkflowSummaryDetails from '../workflow-summary-details';
import {
  type WorkflowSummaryDetailsConfig,
  type Props,
} from '../workflow-summary-details.types';

jest.mock(
  '../../config/workflow-summary-details.config',
  () =>
    [
      {
        key: 'testKey1',
        getLabel: () => 'Test Label 1',
        valueComponent: () => <span>Test Value 1</span>,
        getCopyText: () => 'Test Copy Text 1',
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
      {
        key: 'testKey4',
        getLabel: () => 'Test Label 4',
        valueComponent: () => <span>Test Value 4</span>,
        getCopyText: () => undefined,
      },
    ] satisfies WorkflowSummaryDetailsConfig[]
);

jest.mock(
  '@/components/copy-text-button/copy-text-button',
  () =>
    function MockCopyTextButton({
      textToCopy,
      ...buttonProps
    }: {
      textToCopy: string;
    }) {
      return <button {...buttonProps}>{textToCopy}</button>;
    }
);

const params: Props['decodedPageUrlParams'] = {
  cluster: 'testCluster',
  domain: 'testDomain',
  workflowId: 'testWorkflowId',
  runId: 'testRunId',
  workflowTab: 'summary',
};

const mockWorkflowDetails: DescribeWorkflowResponse = {
  executionConfiguration: null,
  pendingChildren: [],
  pendingActivities: [],
  pendingDecision: null,
  workflowExecutionInfo: null,
};

describe('WorkflowSummaryDetails', () => {
  it('should render workflow type name from firstHistoryEvent', () => {
    setup();

    expect(screen.getByText(/Workflow:/)).toBeInTheDocument();
    expect(screen.getByText('workflow.cron')).toBeInTheDocument();
  });

  it('should render all detail rows that are not hidden', () => {
    setup();

    expect(screen.getByText('Test Label 1')).toBeInTheDocument();
    expect(screen.getByText('Test Value 1')).toBeInTheDocument();
    expect(screen.getByText('Test Label 2')).toBeInTheDocument();
    expect(screen.getByText('Test Value 2')).toBeInTheDocument();
  });

  it('should not render detail rows that are hidden', () => {
    setup();

    expect(screen.queryByText('Hidden Label 3')).not.toBeInTheDocument();
    expect(screen.queryByText('Hidden Value 3')).not.toBeInTheDocument();
  });

  it('should render a copy button for rows that provide copy text', () => {
    setup();

    expect(
      screen.getByRole('button', { name: 'Copy Test Label 1' })
    ).toHaveTextContent('Test Copy Text 1');
  });

  it('should not render a copy button for rows without copy text', () => {
    setup();

    expect(
      screen.queryByRole('button', { name: 'Copy Test Label 2' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Copy Test Label 4' })
    ).not.toBeInTheDocument();
  });
});

function setup() {
  render(
    <WorkflowSummaryDetails
      firstHistoryEvent={startWorkflowExecutionEvent}
      closeHistoryEvent={completeWorkflowExecutionEvent}
      formattedFirstHistoryEvent={mockFormattedFirstEvent}
      formattedCloseHistoryEvent={formatWorkflowHistoryEvent(
        completeWorkflowExecutionEvent
      )}
      workflowDetails={mockWorkflowDetails}
      decodedPageUrlParams={params}
    />
  );
}
