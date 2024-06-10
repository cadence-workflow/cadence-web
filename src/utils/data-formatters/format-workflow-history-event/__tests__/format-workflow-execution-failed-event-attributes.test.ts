import formatWorkflowExecutionFailedEventAttributes from '../format-workflow-execution-failed-event-attributes';
import formatFailureDetails from '../../format-failure-details';
import formatWorkflowEventId from '../../format-workflow-event-id';

jest.mock('../../format-failure-details');
jest.mock('../../format-workflow-event-id');

const mockedFormatFailureDetails = formatFailureDetails as jest.MockedFunction<
  typeof formatFailureDetails
>;
const mockedFormatWorkflowEventId =
  formatWorkflowEventId as jest.MockedFunction<typeof formatWorkflowEventId>;

describe('formatWorkflowExecutionFailedEventAttributes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should format attributes correctly with valid input', () => {
    const failure = { reason: 'some reason' };
    const decisionTaskCompletedEventId = 123;

    mockedFormatWorkflowEventId.mockReturnValueOnce(123);
    mockedFormatFailureDetails.mockReturnValueOnce('formattedFailureDetails');

    const formattedAttributes = formatWorkflowExecutionFailedEventAttributes({
      failure,
      decisionTaskCompletedEventId,
    });

    expect(formattedAttributes).toEqual({
      decisionTaskCompletedEventId: 123,
      details: 'formattedFailureDetails',
      reason: 'some reason',
    });
  });
});
