import formatPayload from '../../format-payload';
import formatWorkflowEventId from '../../format-workflow-event-id';
import formatWorkflowExecutionCompletedEventAttributes from '../format-workflow-execution-completed-event-attributes';

jest.mock('../../format-workflow-event-id');
jest.mock('../../format-payload');
const mockedFormatWorkflowEventId =
  formatWorkflowEventId as jest.MockedFunction<typeof formatWorkflowEventId>;
const mockedFormatPayload = formatPayload as jest.MockedFunction<
  typeof formatPayload
>;

describe('formatWorkflowExecutionCompletedEventAttributes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should format attributes correctly with valid input', () => {
    const decisionTaskCompletedEventId = 123;
    const result = { data: 'someData' };
    mockedFormatWorkflowEventId.mockReturnValueOnce(
      decisionTaskCompletedEventId
    );
    mockedFormatPayload.mockReturnValueOnce(result);

    const formattedAttributes = formatWorkflowExecutionCompletedEventAttributes(
      {
        decisionTaskCompletedEventId,
        result,
      }
    );

    expect(formatWorkflowEventId).toHaveBeenCalledWith(
      decisionTaskCompletedEventId
    );
    expect(formatPayload).toHaveBeenCalledWith(result);

    expect(formattedAttributes).toEqual({
      decisionTaskCompletedEventId,
      result,
    });
  });

  test('should call formatWorkflowEventId with decisionTaskCompletedEventId', () => {
    const decisionTaskCompletedEventId = 123;
    const result = { data: 'someData' };

    formatWorkflowExecutionCompletedEventAttributes({
      decisionTaskCompletedEventId,
      result,
    });

    expect(formatWorkflowEventId).toHaveBeenCalledWith(
      decisionTaskCompletedEventId
    );
  });

  test('should call formatPayload with result', () => {
    const decisionTaskCompletedEventId = 123;
    const result = { data: 'someData' };

    formatWorkflowExecutionCompletedEventAttributes({
      decisionTaskCompletedEventId,
      result,
    });

    expect(formatPayload).toHaveBeenCalledWith(result);
  });
});
