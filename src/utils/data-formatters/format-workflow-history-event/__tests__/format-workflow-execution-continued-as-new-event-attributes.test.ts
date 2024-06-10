import formatWorkflowExecutionContinuedAsNewEventAttributes from '../format-workflow-execution-continued-as-new-event-attributes';
import formatDurationToSeconds from '../../format-duration-to-seconds';
import formatWorkflowEventId from '../../format-workflow-event-id';
import formatFailureDetails from '../../format-failure-details';
import formatEnum from '../../format-enum';
import formatPayloadMap from '../../format-payload-map';
import formatWorkflowInputPayload from '../../format-workflow-input-payload';

jest.mock('../../format-duration-to-seconds');
jest.mock('../../format-workflow-event-id');
jest.mock('../../format-failure-details');
jest.mock('../../format-enum');
jest.mock('../../format-payload-map');
jest.mock('../../format-workflow-input-payload');

const mockedFormatDurationToSeconds =
  formatDurationToSeconds as jest.MockedFunction<
    typeof formatDurationToSeconds
  >;
const mockedFormatWorkflowEventId =
  formatWorkflowEventId as jest.MockedFunction<typeof formatWorkflowEventId>;
const mockedFormatFailureDetails = formatFailureDetails as jest.MockedFunction<
  typeof formatFailureDetails
>;
const mockedFormatEnum = formatEnum as jest.MockedFunction<typeof formatEnum>;
const mockedFormatPayloadMap = formatPayloadMap as jest.MockedFunction<
  typeof formatPayloadMap
>;
const mockedFormatWorkflowInputPayload =
  formatWorkflowInputPayload as jest.MockedFunction<
    typeof formatWorkflowInputPayload
  >;

describe('formatWorkflowExecutionContinuedAsNewEventAttributes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should format attributes correctly with valid input', () => {
    const eventAttributes = {
      backoffStartInterval: { seconds: 60 },
      decisionTaskCompletedEventId: 123,
      executionStartToCloseTimeout: { seconds: 3600 },
      failure: { reason: 'failure reason' },
      header: { fields: { key: 'value' } },
      initiator: 'someInitiator',
      input: { data: 'someData' },
      memo: { fields: { memoKey: 'memoValue' } },
      searchAttributes: { indexedFields: { attrKey: 'attrValue' } },
      taskList: { kind: 'someKind', name: 'taskListName' },
      taskStartToCloseTimeout: { seconds: 1800 },
    };

    mockedFormatDurationToSeconds
      .mockReturnValueOnce(60)
      .mockReturnValueOnce(3600)
      .mockReturnValueOnce(1800);
    mockedFormatWorkflowEventId.mockReturnValueOnce(123);
    mockedFormatFailureDetails.mockReturnValueOnce('formattedFailureDetails');
    mockedFormatEnum
      .mockReturnValueOnce('formattedInitiator')
      .mockReturnValueOnce('formattedKind');
    mockedFormatPayloadMap
      .mockReturnValueOnce(eventAttributes.header)
      .mockReturnValueOnce(eventAttributes.memo)
      .mockReturnValueOnce(eventAttributes.searchAttributes);
    mockedFormatWorkflowInputPayload.mockReturnValueOnce(['someData']);

    const formattedAttributes =
      formatWorkflowExecutionContinuedAsNewEventAttributes(eventAttributes);
    expect(formattedAttributes).toEqual({
      decisionTaskCompletedEventId: 123,
      executionStartToCloseTimeoutSeconds: 3600,
      header: { fields: { key: 'value' } },
      initiator: 'formattedInitiator',
      input: ['someData'],
      memo: { fields: { memoKey: 'memoValue' } },
      searchAttributes: { indexedFields: { attrKey: 'attrValue' } },
      taskList: {
        kind: 'formattedKind',
        name: 'taskListName',
      },
      backoffStartIntervalInSeconds: 60,
      failureDetails: 'formattedFailureDetails',
      failureReason: 'failure reason',
      taskStartToCloseTimeoutSeconds: 1800,
    });
  });
});
