import formatWorkflowExecutionCancelRequestedEventAttributes from '../format-workflow-execution-cancel-requested-event-attributes';
import formatWorkflowExecutionCanceledEventAttributes from '../format-workflow-execution-canceled-event-attributes';
import formatWorkflowExecutionCompletedEventAttributes from '../format-workflow-execution-completed-event-attributes';
import formatWorkflowExecutionContinuedAsNewEventAttributes from '../format-workflow-execution-continued-as-new-event-attributes';
import formatWorkflowExecutionFailedEventAttributes from '../format-workflow-execution-failed-event-attributes';
import formatWorkflowExecutionSignaledEventAttributes from '../format-workflow-execution-signaled-event-attributes';
import formatWorkflowExecutionStartedEventAttributes from '../format-workflow-execution-started-event-attributes';
import formatWorkflowExecutionTerminatedEventAttributes from '../format-workflow-execution-terminated-event-attributes';
import formatWorkflowHistoryEvent, {
  type AttributesFormattersEvent,
} from '../index';

jest.mock('../format-workflow-execution-cancel-requested-event-attributes');
jest.mock('../format-workflow-execution-canceled-event-attributes');
jest.mock('../format-workflow-execution-completed-event-attributes');
jest.mock('../format-workflow-execution-continued-as-new-event-attributes');
jest.mock('../format-workflow-execution-failed-event-attributes');
jest.mock('../format-workflow-execution-signaled-event-attributes');
jest.mock('../format-workflow-execution-started-event-attributes');
jest.mock('../format-workflow-execution-terminated-event-attributes');

const mockedFormatWorkflowExecutionCancelRequestedEventAttributes =
  formatWorkflowExecutionCancelRequestedEventAttributes as jest.MockedFunction<
    typeof formatWorkflowExecutionCancelRequestedEventAttributes
  >;
const mockedFormatWorkflowExecutionCanceledEventAttributes =
  formatWorkflowExecutionCanceledEventAttributes as jest.MockedFunction<
    typeof formatWorkflowExecutionCanceledEventAttributes
  >;
const mockedFormatWorkflowExecutionCompletedEventAttributes =
  formatWorkflowExecutionCompletedEventAttributes as jest.MockedFunction<
    typeof formatWorkflowExecutionCompletedEventAttributes
  >;
const mockedFormatWorkflowExecutionContinuedAsNewEventAttributes =
  formatWorkflowExecutionContinuedAsNewEventAttributes as jest.MockedFunction<
    typeof formatWorkflowExecutionContinuedAsNewEventAttributes
  >;
const mockedFormatWorkflowExecutionFailedEventAttributes =
  formatWorkflowExecutionFailedEventAttributes as jest.MockedFunction<
    typeof formatWorkflowExecutionFailedEventAttributes
  >;
const mockedFormatWorkflowExecutionSignaledEventAttributes =
  formatWorkflowExecutionSignaledEventAttributes as jest.MockedFunction<
    typeof formatWorkflowExecutionSignaledEventAttributes
  >;
const mockedFormatWorkflowExecutionStartedEventAttributes =
  formatWorkflowExecutionStartedEventAttributes as jest.MockedFunction<
    typeof formatWorkflowExecutionStartedEventAttributes
  >;
const mockedFormatWorkflowExecutionTerminatedEventAttributes =
  formatWorkflowExecutionTerminatedEventAttributes as jest.MockedFunction<
    typeof formatWorkflowExecutionTerminatedEventAttributes
  >;

describe('formatWorkflowHistoryEvent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const testCases: AttributesFormattersEvent[] = [
    {
      attributes: 'workflowExecutionCancelRequestedEventAttributes',
      formatter: mockedFormatWorkflowExecutionCancelRequestedEventAttributes,
    },
    {
      attributes: 'workflowExecutionCanceledEventAttributes',
      formatter: mockedFormatWorkflowExecutionCanceledEventAttributes,
    },
    {
      attributes: 'workflowExecutionCompletedEventAttributes',
      formatter: mockedFormatWorkflowExecutionCompletedEventAttributes,
    },
    {
      attributes: 'workflowExecutionContinuedAsNewEventAttributes',
      formatter: mockedFormatWorkflowExecutionContinuedAsNewEventAttributes,
    },
    {
      attributes: 'workflowExecutionFailedEventAttributes',
      formatter: mockedFormatWorkflowExecutionFailedEventAttributes,
    },
    {
      attributes: 'workflowExecutionSignaledEventAttributes',
      formatter: mockedFormatWorkflowExecutionSignaledEventAttributes,
    },
    {
      attributes: 'workflowExecutionStartedEventAttributes',
      formatter: mockedFormatWorkflowExecutionStartedEventAttributes,
    },
    {
      attributes: 'workflowExecutionTerminatedEventAttributes',
      formatter: mockedFormatWorkflowExecutionTerminatedEventAttributes,
    },
  ];

  testCases.forEach(({ attributes, formatter }) => {
    test(`should format ${attributes} correctly`, () => {
      const event = {
        attributes: attributes,
        [attributes]: { someData: 'someValue' },
      };

      formatter.mockReturnValueOnce({ formattedData: 'formattedValue' });

      const result = formatWorkflowHistoryEvent(event);

      expect(formatter).toHaveBeenCalledWith(event[attributes]);
      expect(result).toEqual({
        [attributes]: { formattedData: 'formattedValue' },
      });
    });
  });

  test('should return event as is if no formatter is found', () => {
    const event = {
      attributes: 'unknownAttributes',
      someData: 'someValue',
    };

    // @ts-expect-error - intentionally testing unknown attributes
    const result = formatWorkflowHistoryEvent(event);

    expect(result).toEqual(event);
  });
});
