import formatDurationToSeconds from '../../format-duration-to-seconds';
import formatEnum from '../../format-enum';
import formatFailureDetails from '../../format-failure-details';
import formatPayloadMap from '../../format-payload-map';
import formatPrevAutoResetPoints from '../../format-prev-auto-reset-points';
import formatRetryPolicy from '../../format-retry-policy';
import formatTimestampToDatetime from '../../format-timestamp-to-datetime';
import formatWorkflowInputPayload from '../../format-workflow-input-payload';
import formatWorkflowExecutionStartedEventAttributes from '../format-workflow-execution-started-event-attributes';

jest.mock('../../format-workflow-input-payload');
jest.mock('../../format-enum');
jest.mock('../../format-failure-details');
jest.mock('../../format-payload-map');
jest.mock('../../format-timestamp-to-datetime');
jest.mock('../../format-duration-to-seconds');
jest.mock('../../format-retry-policy');
jest.mock('../../format-prev-auto-reset-points');

const mockedFormatWorkflowInputPayload =
  formatWorkflowInputPayload as jest.MockedFunction<
    typeof formatWorkflowInputPayload
  >;
const mockedFormatEnum = formatEnum as jest.MockedFunction<typeof formatEnum>;
const mockedFormatFailureDetails = formatFailureDetails as jest.MockedFunction<
  typeof formatFailureDetails
>;
const mockedFormatPayloadMap = formatPayloadMap as jest.MockedFunction<
  typeof formatPayloadMap
>;
const mockedFormatTimestampToDatetime =
  formatTimestampToDatetime as jest.MockedFunction<
    typeof formatTimestampToDatetime
  >;
const mockedFormatDurationToSeconds =
  formatDurationToSeconds as jest.MockedFunction<
    typeof formatDurationToSeconds
  >;
const mockedFormatRetryPolicy = formatRetryPolicy as jest.MockedFunction<
  typeof formatRetryPolicy
>;
const mockedFormatPrevAutoResetPoints =
  formatPrevAutoResetPoints as jest.MockedFunction<
    typeof formatPrevAutoResetPoints
  >;

describe('formatWorkflowExecutionStartedEventAttributes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should format attributes correctly with valid input', () => {
    const eventAttributes = {
      attempt: 1,
      continuedExecutionRunId: 'continuedRunId',
      continuedFailure: { reason: 'failure reason' },
      cronSchedule: '*/5 * * * *',
      executionStartToCloseTimeout: { seconds: 3600 },
      expirationTime: { seconds: 1652817600 },
      firstDecisionTaskBackoff: { seconds: 60 },
      firstExecutionRunId: 'firstRunId',
      firstScheduledTimeNano: 123456789,
      identity: 'identity',
      initiator: 'someInitiator',
      input: { data: 'someData' },
      memo: { fields: { memoKey: 'memoValue' } },
      originalExecutionRunId: 'originalRunId',
      parentExecutionInfo: {
        initiatedId: '456',
        domainName: 'parentDomain',
        workflowExecution: 'parentWorkflow',
      },
      prevAutoResetPoints: {
        points: [
          {
            createdTime: { seconds: 123, nanos: 456 },
            expiringTime: { seconds: 789, nanos: 101 },
          },
        ],
      },
      retryPolicy: {
        expirationInterval: { seconds: 600 },
        initialInterval: { seconds: 30 },
        maximumInterval: { seconds: 300 },
      },
      searchAttributes: { indexedFields: { attrKey: 'attrValue' } },
      taskList: { kind: 'someKind', name: 'taskListName' },
      taskStartToCloseTimeout: { seconds: 1800 },
    };

    mockedFormatWorkflowInputPayload.mockReturnValueOnce(['someData']);
    mockedFormatEnum
      .mockReturnValueOnce('formattedKind')
      .mockReturnValueOnce('formattedInitiator');
    mockedFormatFailureDetails.mockReturnValueOnce('formattedFailureDetails');
    mockedFormatPayloadMap
      .mockReturnValueOnce(eventAttributes.memo)
      .mockReturnValueOnce(eventAttributes.searchAttributes);
    mockedFormatTimestampToDatetime.mockReturnValueOnce(
      new Date(1652817600000)
    );
    mockedFormatDurationToSeconds
      .mockReturnValueOnce(3600)
      .mockReturnValueOnce(1800)
      .mockReturnValueOnce(60);
    mockedFormatRetryPolicy.mockReturnValueOnce({
      expirationIntervalInSeconds: 600,
      initialIntervalInSeconds: 30,
      maximumIntervalInSeconds: 300,
    });
    mockedFormatPrevAutoResetPoints.mockReturnValueOnce({
      points: [
        {
          createdTimeNano: new Date(123456000),
          expiringTimeNano: new Date(789000101),
        },
      ],
    });

    const formattedAttributes =
      formatWorkflowExecutionStartedEventAttributes(eventAttributes);

    expect(mockedFormatWorkflowInputPayload).toHaveBeenCalledWith(
      eventAttributes.input
    );
    expect(formatEnum).toHaveBeenCalledWith(
      eventAttributes.initiator,
      'CONTINUE_AS_NEW_INITIATOR'
    );
    expect(formatFailureDetails).toHaveBeenCalledWith(
      eventAttributes.continuedFailure
    );
    expect(formatPayloadMap).toHaveBeenCalledWith(
      eventAttributes.memo,
      'fields'
    );
    expect(formatTimestampToDatetime).toHaveBeenCalledWith(
      eventAttributes.expirationTime
    );
    expect(formatDurationToSeconds).toHaveBeenCalledWith(
      eventAttributes.executionStartToCloseTimeout
    );
    expect(formatDurationToSeconds).toHaveBeenCalledWith(
      eventAttributes.firstDecisionTaskBackoff
    );
    expect(formatRetryPolicy).toHaveBeenCalledWith(eventAttributes.retryPolicy);
    expect(formatPrevAutoResetPoints).toHaveBeenCalledWith(
      eventAttributes.prevAutoResetPoints
    );
    expect(formattedAttributes).toEqual({
      taskList: {
        kind: 'formattedKind',
        name: 'taskListName',
      },
      input: ['someData'],
      executionStartToCloseTimeoutSeconds: 3600,
      taskStartToCloseTimeoutSeconds: 1800,
      attempt: 1,
      continuedExecutionRunId: 'continuedRunId',
      continuedFailureDetails: 'formattedFailureDetails',
      continuedFailureReason: 'failure reason',
      cronSchedule: '*/5 * * * *',
      expirationTimestamp: new Date(1652817600000),
      firstDecisionTaskBackoffSeconds: 60,
      firstExecutionRunId: 'firstRunId',
      firstScheduledTimeNano: 123456789,
      identity: 'identity',
      initiator: 'formattedInitiator',
      memo: eventAttributes.memo,
      originalExecutionRunId: 'originalRunId',
      parentInitiatedEventId: 456,
      parentWorkflowDomain: 'parentDomain',
      parentWorkflowExecution: 'parentWorkflow',
      prevAutoResetPoints: {
        points: [
          {
            createdTimeNano: new Date(123456000),
            expiringTimeNano: new Date(789000101),
          },
        ],
      },
      retryPolicy: {
        expirationIntervalInSeconds: 600,

        initialIntervalInSeconds: 30,
        maximumIntervalInSeconds: 300,
      },
      searchAttributes: eventAttributes.searchAttributes,
    });
  });
});
