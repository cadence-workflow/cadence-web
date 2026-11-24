import { type BatchOperation__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/BatchOperation';
import { type StartBatchOperationRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/StartBatchOperationRequest';

import { type StartBatchActionRequestBody } from '../start-batch-action.types';

function buildOperation(
  body: StartBatchActionRequestBody
): BatchOperation__Input {
  switch (body.batchType) {
    case 'terminate':
      return { terminate: {} };
    case 'cancel':
      return { cancel: {} };
    case 'signal':
      return {
        signal: {
          signalName: body.signalParams.signalName,
          input: body.signalParams.signalInput
            ? { data: Buffer.from(body.signalParams.signalInput) }
            : undefined,
        },
      };
  }
}

export default function transformStartBatchActionBodyToGrpcInput({
  domain,
  batchId,
  identity,
  body,
}: {
  domain: string;
  batchId: string;
  identity: string | undefined;
  body: StartBatchActionRequestBody;
}): StartBatchOperationRequest__Input {
  return {
    domain,
    batchId,
    query: body.query,
    operation: buildOperation(body),
    reason: body.reason,
    identity,
    // Concurrency and page size are left unset so the server applies its defaults
    limits: { rps: body.rps },
  };
}
