import { type DescribeWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeWorkflowExecutionResponse';
import logger from '@/utils/logger';

import {
  MOCK_BATCH_PROGRESS,
  mockBatcherCloseEventHistory,
  mockBatcherStartedHistory,
  mockDescribeBatchOperationWorkflowRunning,
  mockDescribeBatchOperationWorkflowRunningWithProgress,
} from '../../__fixtures__/mock-describe-batch-operation-workflow';
import {
  getFinalProgressFromCloseEvent,
  getRunningProgressFromDescribe,
} from '../get-batch-action-progress';

jest.mock('@/utils/logger');

const EXPECTED_PROGRESS = {
  totalEstimate: MOCK_BATCH_PROGRESS.TotalEstimate,
  successCount: MOCK_BATCH_PROGRESS.SuccessCount,
  errorCount: MOCK_BATCH_PROGRESS.ErrorCount,
};

const encode = (value: unknown) =>
  Buffer.from(JSON.stringify(value)).toString('base64');

const baseActivity =
  mockDescribeBatchOperationWorkflowRunningWithProgress.pendingActivities[0];

const describeWithHeartbeat = (
  data: string | null
): DescribeWorkflowExecutionResponse => ({
  ...mockDescribeBatchOperationWorkflowRunning,
  pendingActivities: [
    { ...baseActivity, heartbeatDetails: data === null ? null : { data } },
  ],
});

describe('getRunningProgressFromDescribe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('decodes progress from the pending activity heartbeat', () => {
    expect(
      getRunningProgressFromDescribe(
        mockDescribeBatchOperationWorkflowRunningWithProgress
      )
    ).toEqual({ progress: EXPECTED_PROGRESS });
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('returns an empty result when there are no pending activities', () => {
    expect(
      getRunningProgressFromDescribe(mockDescribeBatchOperationWorkflowRunning)
    ).toEqual({});
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('returns an empty result when heartbeatDetails is null', () => {
    expect(getRunningProgressFromDescribe(describeWithHeartbeat(null))).toEqual(
      {}
    );
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('flags progressError and logs when the heartbeat lacks TotalEstimate', () => {
    expect(
      getRunningProgressFromDescribe(
        describeWithHeartbeat(encode({ SuccessCount: 1, ErrorCount: 2 }))
      )
    ).toEqual({ progressError: true });
    expect(logger.warn).toHaveBeenCalledTimes(1);
  });

  it('defaults missing counts to 0', () => {
    expect(
      getRunningProgressFromDescribe(
        describeWithHeartbeat(encode({ TotalEstimate: 10 }))
      )
    ).toEqual({
      progress: { totalEstimate: 10, successCount: 0, errorCount: 0 },
    });
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('flags progressError and logs when the heartbeat payload is not JSON', () => {
    expect(
      getRunningProgressFromDescribe(
        describeWithHeartbeat(Buffer.from('not json').toString('base64'))
      )
    ).toEqual({ progressError: true });
    expect(logger.warn).toHaveBeenCalledTimes(1);
  });
});

describe('getFinalProgressFromCloseEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('decodes progress from the completed event result', () => {
    expect(
      getFinalProgressFromCloseEvent(
        mockBatcherCloseEventHistory.history?.events?.[0]
      )
    ).toEqual({ progress: EXPECTED_PROGRESS });
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('returns an empty result when the event is missing', () => {
    expect(getFinalProgressFromCloseEvent(undefined)).toEqual({});
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('returns an empty result when the event is not a completed event', () => {
    expect(
      getFinalProgressFromCloseEvent(
        mockBatcherStartedHistory.history?.events?.[0]
      )
    ).toEqual({});
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('flags progressError and logs when the completed event result is malformed', () => {
    const event = {
      workflowExecutionCompletedEventAttributes: {
        result: { data: Buffer.from('not json').toString('base64') },
      },
    } as NonNullable<Parameters<typeof getFinalProgressFromCloseEvent>[0]>;

    expect(getFinalProgressFromCloseEvent(event)).toEqual({
      progressError: true,
    });
    expect(logger.warn).toHaveBeenCalledTimes(1);
  });
});
