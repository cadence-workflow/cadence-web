import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { completeActivityTaskEvent } from '../../__fixtures__/workflow-history-activity-events';
import generateHistoryEventDetails from '../helpers/generate-history-event-details';
import WorkflowHistoryEventDetails from '../workflow-history-event-details';
import {
  type WorkflowHistoryEventDetailsEntry,
  type Props,
  type WorkflowHistoryEventDetailsConfig,
} from '../workflow-history-event-details.types';

jest.mock('@/utils/data-formatters/format-workflow-history-event', () =>
  jest.fn((event) => (event ? { mockFormatted: true } : null))
);

jest.mock('../helpers/generate-history-event-details', () => jest.fn());
const mockGenerateHistoryEventDetails =
  generateHistoryEventDetails as jest.Mock;

describe('WorkflowHistoryEventDetails', () => {
  const mockParams: Props['decodedPageUrlParams'] = {
    cluster: 'testCluster',
    domain: 'testDomain',
    workflowId: 'testWorkflowId',
    runId: 'testRunId',
    workflowTab: 'history',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders null when detailsEntries is empty', () => {
    mockGenerateHistoryEventDetails.mockReturnValue([]);

    render(
      <WorkflowHistoryEventDetails
        event={completeActivityTaskEvent}
        decodedPageUrlParams={mockParams}
      />
    );
    expect(screen.getByText('No Details')).toBeInTheDocument();
  });

  it('renders details with path and value', () => {
    mockGenerateHistoryEventDetails.mockReturnValue([
      {
        key: '1',
        path: 'test/path',
        value: 'testValue',
      },
    ]);
    render(
      <WorkflowHistoryEventDetails
        event={completeActivityTaskEvent}
        decodedPageUrlParams={mockParams}
      />
    );

    const labelElement = screen.getByText('test/path');
    const valueElement = screen.getByText('testValue');

    expect(labelElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
  });

  it('renders custom label when renderConfig.getLabel is provided', () => {
    mockGenerateHistoryEventDetails.mockReturnValue([
      {
        key: '1',
        path: 'test/path',
        value: 'testValue',
        renderConfig: {
          name: 'test',
          getLabel: ({ key }) => `Custom Label for ${key}`,
          key: '1',
        },
      },
    ] satisfies WorkflowHistoryEventDetailsEntry[]);

    render(
      <WorkflowHistoryEventDetails
        event={completeActivityTaskEvent}
        decodedPageUrlParams={mockParams}
      />
    );

    const labelElement = screen.getByText('Custom Label for 1');
    expect(labelElement).toBeInTheDocument();
  });

  it('renders custom value component when renderConfig.valueComponent is provided', () => {
    const MockValueComponent = (({ entryKey }) => (
      <div>{`Custom component for ${entryKey}`}</div>
    )) as WorkflowHistoryEventDetailsConfig['valueComponent'];

    mockGenerateHistoryEventDetails.mockReturnValue([
      {
        key: '1',
        path: 'test/path',
        value: 'testValue',
        renderConfig: {
          valueComponent: MockValueComponent,
        },
      },
    ]);
    render(
      <WorkflowHistoryEventDetails
        event={completeActivityTaskEvent}
        decodedPageUrlParams={mockParams}
      />
    );

    const valueComponent = screen.getByText('Custom component for 1');
    expect(valueComponent).toBeInTheDocument();
  });
});
