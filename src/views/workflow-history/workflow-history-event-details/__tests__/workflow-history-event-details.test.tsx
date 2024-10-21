import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { completeActivityTaskEvent } from '../../__fixtures__/workflow-history-activity-events';
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
});
