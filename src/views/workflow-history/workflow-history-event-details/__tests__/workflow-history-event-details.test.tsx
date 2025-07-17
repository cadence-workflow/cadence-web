import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { completeActivityTaskEvent } from '../../__fixtures__/workflow-history-activity-events';
import { pendingActivityTaskStartEvent } from '../../__fixtures__/workflow-history-pending-events';
import { workflowPageUrlParams } from '../../__fixtures__/workflow-page-url-params';
import generateHistoryEventDetails from '../helpers/generate-history-event-details';
import WorkflowHistoryEventDetails from '../workflow-history-event-details';
import { type WorkflowHistoryEventDetailsEntries } from '../workflow-history-event-details.types';

jest.mock('@/utils/data-formatters/format-workflow-history-event', () =>
  jest.fn((event) => (event ? { mockFormatted: true } : null))
);

jest.mock('../helpers/generate-history-event-details', () => jest.fn());
const mockGenerateHistoryEventDetails =
  generateHistoryEventDetails as jest.Mock;

jest.mock(
  '../../workflow-history-event-details-group/workflow-history-event-details-group',
  () =>
    jest.fn(({ entries }) => <div>Mock details: {JSON.stringify(entries)}</div>)
);

describe(WorkflowHistoryEventDetails.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders null when detailsEntries is empty', () => {
    mockGenerateHistoryEventDetails.mockReturnValue([]);

    render(
      <WorkflowHistoryEventDetails
        event={completeActivityTaskEvent}
        decodedPageUrlParams={workflowPageUrlParams}
      />
    );
    expect(screen.getByText('No Details')).toBeInTheDocument();
  });

  it('renders details with path and value', () => {
    mockGenerateHistoryEventDetails.mockReturnValue([
      {
        key: 'testKey',
        path: 'testPath',
        isGroup: false,
        value: 'testValue',
        renderConfig: {
          name: 'Mock render config without custom label',
          customMatcher: () => true,
        },
      },
    ] satisfies WorkflowHistoryEventDetailsEntries);

    render(
      <WorkflowHistoryEventDetails
        event={completeActivityTaskEvent}
        decodedPageUrlParams={workflowPageUrlParams}
      />
    );

    expect(screen.getByText(/"testValue"/)).toBeInTheDocument();
  });

  it('renders pending event details with path and value', () => {
    mockGenerateHistoryEventDetails.mockReturnValue([
      {
        key: 'testKey',
        path: 'testPath',
        isGroup: false,
        value: 'testValue',
        renderConfig: {
          name: 'Mock render config without custom label',
          customMatcher: () => true,
        },
      },
    ] satisfies WorkflowHistoryEventDetailsEntries);

    render(
      <WorkflowHistoryEventDetails
        event={pendingActivityTaskStartEvent}
        decodedPageUrlParams={workflowPageUrlParams}
      />
    );

    expect(screen.getByText(/"testValue"/)).toBeInTheDocument();
  });

  it('passes negativeFields to generateHistoryEventDetails when provided', () => {
    const negativeFields = ['reason', 'details'];
    mockGenerateHistoryEventDetails.mockReturnValue([]);

    render(
      <WorkflowHistoryEventDetails
        event={completeActivityTaskEvent}
        decodedPageUrlParams={workflowPageUrlParams}
        negativeFields={negativeFields}
      />
    );

    expect(mockGenerateHistoryEventDetails).toHaveBeenCalledWith({
      details: { mockFormatted: true },
      negativeFields,
    });
  });

  it('does not pass negativeFields to generateHistoryEventDetails when not provided', () => {
    mockGenerateHistoryEventDetails.mockReturnValue([]);

    render(
      <WorkflowHistoryEventDetails
        event={completeActivityTaskEvent}
        decodedPageUrlParams={workflowPageUrlParams}
      />
    );

    expect(mockGenerateHistoryEventDetails).toHaveBeenCalledWith({
      details: { mockFormatted: true },
    });
  });

  it('passes empty negativeFields array to generateHistoryEventDetails when provided as empty', () => {
    const negativeFields: string[] = [];
    mockGenerateHistoryEventDetails.mockReturnValue([]);

    render(
      <WorkflowHistoryEventDetails
        event={completeActivityTaskEvent}
        decodedPageUrlParams={workflowPageUrlParams}
        negativeFields={negativeFields}
      />
    );

    expect(mockGenerateHistoryEventDetails).toHaveBeenCalledWith({
      details: { mockFormatted: true },
      negativeFields,
    });
  });
});
