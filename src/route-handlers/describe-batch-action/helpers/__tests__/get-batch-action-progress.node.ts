import { type DescribeWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeWorkflowExecutionResponse';

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

const EXPECTED = {
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
  it('decodes progress from the pending activity heartbeat', () => {
    expect(
      getRunningProgressFromDescribe(
        mockDescribeBatchOperationWorkflowRunningWithProgress
      )
    ).toEqual(EXPECTED);
  });

  it('returns undefined when there are no pending activities', () => {
    expect(
      getRunningProgressFromDescribe(mockDescribeBatchOperationWorkflowRunning)
    ).toBeUndefined();
  });

  it('returns undefined when heartbeatDetails is null', () => {
    expect(
      getRunningProgressFromDescribe(describeWithHeartbeat(null))
    ).toBeUndefined();
  });

  it('returns undefined when the heartbeat lacks TotalEstimate', () => {
    expect(
      getRunningProgressFromDescribe(
        describeWithHeartbeat(encode({ SuccessCount: 1, ErrorCount: 2 }))
      )
    ).toBeUndefined();
  });

  it('defaults missing counts to 0', () => {
    expect(
      getRunningProgressFromDescribe(
        describeWithHeartbeat(encode({ TotalEstimate: 10 }))
      )
    ).toEqual({ totalEstimate: 10, successCount: 0, errorCount: 0 });
  });

  it('returns undefined when the heartbeat payload is not JSON', () => {
    expect(
      getRunningProgressFromDescribe(
        describeWithHeartbeat(Buffer.from('not json').toString('base64'))
      )
    ).toBeUndefined();
  });
});

describe('getFinalProgressFromCloseEvent', () => {
  it('decodes progress from the completed event result', () => {
    expect(
      getFinalProgressFromCloseEvent(
        mockBatcherCloseEventHistory.history?.events?.[0]
      )
    ).toEqual(EXPECTED);
  });

  it('returns undefined when the event is missing', () => {
    expect(getFinalProgressFromCloseEvent(undefined)).toBeUndefined();
  });

  it('returns undefined when the event is not a completed event', () => {
    expect(
      getFinalProgressFromCloseEvent(
        mockBatcherStartedHistory.history?.events?.[0]
      )
    ).toBeUndefined();
  });
});
