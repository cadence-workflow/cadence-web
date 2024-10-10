import { completeActivityTaskEvent } from '@/views/workflow-history/__fixtures__/workflow-history-activity-events';

import formatTimestampToDatetime from '../format-timestamp-to-datetime';
import formatWorkflowHistory from '../format-workflow-history';
import formatWorkflowHistoryEvent from '../format-workflow-history-event';

jest.mock('../format-timestamp-to-datetime');
jest.mock('../format-workflow-history-event');
jest.mock('../format-workflow-history-event-type');

const mockedFormatTimestampToDatetime =
  formatTimestampToDatetime as jest.MockedFunction<
    typeof formatTimestampToDatetime
  >;

const mockedFormatWorkflowHistoryEvent =
  formatWorkflowHistoryEvent as jest.MockedFunction<
    typeof formatWorkflowHistoryEvent
  >;

describe('formatWorkflowHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should format workflow history correctly', () => {
    const expectedTimestamp = new Date('2023-06-18T12:34:56.Z');
    mockedFormatTimestampToDatetime.mockReturnValue(expectedTimestamp);
    //@ts-expect-error using mock value that doesn't match formatting schema for easier validation
    mockedFormatWorkflowHistoryEvent.mockReturnValue({ formattedEvent: true });

    const input = {
      archived: true,
      history: {
        events: [completeActivityTaskEvent],
      },
      rawHistory: [],
      nextPageToken: '',
    };

    const expectedOutput = {
      archived: true,
      history: {
        events: [
          {
            formattedEvent: true,
          },
        ],
      },
      rawHistory: null,
      nextPageToken: '',
    };

    expect(formatWorkflowHistory(input)).toEqual(expectedOutput);
  });

  it('should set archived to null if not provided', () => {
    const input = {
      history: {
        events: [],
      },
      rawHistory: [],
      nextPageToken: '',
    };

    const expectedOutput = {
      archived: null,
      history: {
        events: [],
      },
      rawHistory: null,
      nextPageToken: '',
    };
    //@ts-expect-error testing missing archived field
    expect(formatWorkflowHistory(input)).toEqual(expectedOutput);
  });

  it('should set rawHistory to null if empty array is provided', () => {
    const input = {
      history: {
        events: [],
      },
      rawHistory: [],
      nextPageToken: '',
      archived: false,
    };

    const expectedOutput = {
      archived: null,
      history: {
        events: [],
      },
      rawHistory: null,
      nextPageToken: '',
    };

    expect(formatWorkflowHistory(input)).toEqual(expectedOutput);
  });

  it('should handle empty events array', () => {
    const input = {
      archived: true,
      history: {
        events: [],
      },
      rawHistory: [],
      nextPageToken: '',
    };

    const expectedOutput = {
      archived: true,
      history: {
        events: [],
      },
      rawHistory: null,
      nextPageToken: '',
    };

    expect(formatWorkflowHistory(input)).toEqual(expectedOutput);
  });

  it('should handle null rawHistory', () => {
    const input = {
      archived: true,
      history: {
        events: [],
      },
      rawHistory: null,
      nextPageToken: '',
    };

    const expectedOutput = {
      archived: true,
      history: {
        events: [],
      },
      rawHistory: null,
      nextPageToken: '',
    };
    //@ts-expect-error testing null raw history
    expect(formatWorkflowHistory(input)).toEqual(expectedOutput);
  });
});
