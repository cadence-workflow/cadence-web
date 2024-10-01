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
      rawHistory: ['raw event data'],
      otherData: 'some other data',
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
      rawHistory: ['raw event data'],
      otherData: 'some other data',
    };

    expect(formatWorkflowHistory(input)).toEqual(expectedOutput);
  });

  it('should set archived to null if not provided', () => {
    const input = {
      history: {
        events: [],
      },
      rawHistory: [],
    };

    const expectedOutput = {
      archived: null,
      history: {
        events: [],
      },
      rawHistory: null,
    };

    expect(formatWorkflowHistory(input)).toEqual(expectedOutput);
  });

  it('should set rawHistory to null if empty array is provided', () => {
    const input = {
      history: {
        events: [],
      },
      rawHistory: [],
    };

    const expectedOutput = {
      archived: null,
      history: {
        events: [],
      },
      rawHistory: null,
    };

    expect(formatWorkflowHistory(input)).toEqual(expectedOutput);
  });

  it('should handle empty events array', () => {
    const input = {
      archived: true,
      history: {
        events: [],
      },
      rawHistory: ['raw event data'],
    };

    const expectedOutput = {
      archived: true,
      history: {
        events: [],
      },
      rawHistory: ['raw event data'],
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
    };

    const expectedOutput = {
      archived: true,
      history: {
        events: [],
      },
      rawHistory: null,
    };

    expect(formatWorkflowHistory(input)).toEqual(expectedOutput);
  });
});
