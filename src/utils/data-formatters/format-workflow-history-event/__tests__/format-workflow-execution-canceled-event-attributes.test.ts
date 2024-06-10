import formatWorkflowExecutionCanceledEventAttributes from '../format-workflow-execution-canceled-event-attributes';
import formatWorkflowEventId from '../../format-workflow-event-id';
import formatPayload from '../../format-payload';

jest.mock('../../format-workflow-event-id');
jest.mock('../../format-payload');

const mockedFormatWorkflowEventId =
  formatWorkflowEventId as jest.MockedFunction<typeof formatWorkflowEventId>;
const mockedFormatPayload = formatPayload as jest.MockedFunction<
  typeof formatPayload
>;

describe('formatWorkflowExecutionCanceledEventAttributes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should format attributes correctly with valid input', () => {
    const decisionTaskCompletedEventId = 123;
    const details = { data: 'someData' };

    mockedFormatWorkflowEventId.mockReturnValueOnce(
      decisionTaskCompletedEventId
    );
    mockedFormatPayload.mockReturnValueOnce(details);

    const formattedAttributes = formatWorkflowExecutionCanceledEventAttributes({
      decisionTaskCompletedEventId,
      details,
    });

    expect(formattedAttributes).toEqual({
      decisionTaskCompletedEventId,
      details,
    });
  });

  test('should call formatWorkflowEventId with decisionTaskCompletedEventId', () => {
    const decisionTaskCompletedEventId = 123;
    const details = { data: 'someData' };

    formatWorkflowExecutionCanceledEventAttributes({
      decisionTaskCompletedEventId,
      details,
    });

    expect(formatWorkflowEventId).toHaveBeenCalledWith(
      decisionTaskCompletedEventId
    );
  });

  test('should call formatPayload with details', () => {
    const decisionTaskCompletedEventId = 123;
    const details = { data: 'someData' };

    formatWorkflowExecutionCanceledEventAttributes({
      decisionTaskCompletedEventId,
      details,
    });

    expect(formatPayload).toHaveBeenCalledWith(details);
  });
});
