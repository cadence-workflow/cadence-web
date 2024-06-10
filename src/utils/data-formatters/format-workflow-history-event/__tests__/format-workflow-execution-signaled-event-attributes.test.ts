import formatWorkflowExecutionSignaledEventAttributes from '../format-workflow-execution-signaled-event-attributes';
import formatWorkflowInputPayload from '../../format-workflow-input-payload';

jest.mock('../../format-workflow-input-payload');

const mockedFormatWorkflowInputPayload =
  formatWorkflowInputPayload as jest.MockedFunction<
    typeof formatWorkflowInputPayload
  >;

describe('formatWorkflowExecutionSignaledEventAttributes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should format attributes correctly with valid input', () => {
    const input = { data: 'someData' };

    const mockedFormattedInput = ['someData'];
    mockedFormatWorkflowInputPayload.mockReturnValueOnce(mockedFormattedInput);

    const formattedAttributes = formatWorkflowExecutionSignaledEventAttributes({
      input,
    });

    expect(mockedFormatWorkflowInputPayload).toHaveBeenCalledWith(input);
    expect(formattedAttributes).toEqual({
      input: mockedFormattedInput,
    });
  });
});
