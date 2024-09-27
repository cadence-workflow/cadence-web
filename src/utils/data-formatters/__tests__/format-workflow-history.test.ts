import formatTimestampToDatetime from '../format-timestamp-to-datetime';
import formatWorkflowHistory from '../format-workflow-history';
import formatWorkflowHistoryEvent from '../format-workflow-history-event';
import formatWorkflowHistoryEventType from '../format-workflow-history-event-type';

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
const mockedFormatWorkflowHistoryEventType =
  formatWorkflowHistoryEventType as jest.MockedFunction<
    typeof formatWorkflowHistoryEventType
  >;

describe('formatWorkflowHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should format workflow history correctly', () => {
    const expectedTimestamp = new Date('2023-06-18T12:34:56.Z');
    mockedFormatTimestampToDatetime.mockReturnValue(expectedTimestamp);
    mockedFormatWorkflowHistoryEvent.mockReturnValue({ formattedEvent: true });
    mockedFormatWorkflowHistoryEventType.mockReturnValue(
      'ActivityTaskCanceled'
    );

    const input = {
      archived: true,
      history: {
        events: [
          {
            eventId: '1',
            eventTime: { seconds: '1234567890', nano: 0 },
            attributes: 'workflowExecutionStartedEventAttributes',
          },
        ],
      },
      rawHistory: ['raw event data'],
      otherData: 'some other data',
    };

    const expectedOutput = {
      archived: true,
      history: {
        events: [
          {
            eventId: 1,
            timestamp: expectedTimestamp,
            eventType: 'ActivityTaskCanceled',
            attributes: 'workflowExecutionStartedEventAttributes',
            formattedEvent: true,
          },
        ],
      },
      rawHistory: ['raw event data'],
      otherData: 'some other data',
    };

    expect(formatWorkflowHistory(input)).toEqual(expectedOutput);
    expect(mockedFormatTimestampToDatetime).toHaveBeenCalledWith({
      seconds: '1234567890',
      nano: 0,
    });
    expect(mockedFormatWorkflowHistoryEvent).toHaveBeenCalledWith({
      attributes: 'workflowExecutionStartedEventAttributes',
    });
    expect(formatWorkflowHistoryEventType).toHaveBeenCalledWith(
      'workflowExecutionStartedEventAttributes'
    );
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
