import {
  type BatchActionPayload,
  type BuildBatchActionPayloadParams,
} from '../hooks/use-start-batch-action.types';

export default function buildBatchActionPayload({
  domain,
  query,
  reason,
  rps,
  batchType,
  signalParams,
}: BuildBatchActionPayloadParams): BatchActionPayload {
  return {
    DomainName: domain,
    Query: query,
    Reason: reason,
    BatchType: batchType,
    RPS: rps,
    ...(batchType === 'signal' &&
      signalParams && {
        SignalParams: {
          SignalName: signalParams.signalName,
          Input: signalParams.signalInput ?? '',
        },
      }),
  };
}
