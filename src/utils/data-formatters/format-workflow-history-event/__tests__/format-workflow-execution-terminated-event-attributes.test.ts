import formatWorkflowExecutionTerminatedEventAttributes from '../format-workflow-execution-terminated-event-attributes';
import formatPayload from '../../format-payload';

jest.mock('../../format-payload');

const mockedFormatPayload = formatPayload as jest.MockedFunction<
  typeof formatPayload
>;

describe('formatWorkflowExecutionTerminatedEventAttributes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should format attributes correctly with valid input', () => {
    const details = { data: 'someData' };

    mockedFormatPayload.mockReturnValueOnce(details);

    const formattedAttributes =
      formatWorkflowExecutionTerminatedEventAttributes({
        details,
      });
    expect(formattedAttributes).toEqual({
      details,
    });
  });

  test('should call formatPayload with details', () => {
    const details = { data: 'someData' };

    formatWorkflowExecutionTerminatedEventAttributes({ details });

    expect(formatPayload).toHaveBeenCalledWith(details);
  });
});
