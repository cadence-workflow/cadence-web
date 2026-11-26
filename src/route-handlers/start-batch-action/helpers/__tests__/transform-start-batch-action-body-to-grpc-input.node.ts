import { type StartBatchActionRequestBody } from '../../start-batch-action.types';
import transformStartBatchActionBodyToGrpcInput from '../transform-start-batch-action-body-to-grpc-input';

const BASE_BODY = {
  query: "WorkflowType = 'demo-wf' AND CloseTime = missing",
  reason: 'cleanup',
  rps: 25,
} as const;

describe(transformStartBatchActionBodyToGrpcInput.name, () => {
  it('maps a terminate action', () => {
    const request = setup({ body: { ...BASE_BODY, batchType: 'terminate' } });

    expect(request).toEqual({
      domain: 'mock-domain',
      batchId: 'mock-batch-id',
      query: BASE_BODY.query,
      operation: { terminate: {} },
      reason: 'cleanup',
      identity: 'mock-user',
      limits: { rps: 25 },
    });
  });

  it('maps a cancel action', () => {
    const request = setup({ body: { ...BASE_BODY, batchType: 'cancel' } });

    expect(request.operation).toEqual({ cancel: {} });
  });

  it('maps a signal action with its input as bytes', () => {
    const request = setup({
      body: {
        ...BASE_BODY,
        batchType: 'signal',
        signalParams: { signalName: 'mock-signal', signalInput: '{"a":1}' },
      },
    });

    expect(request.operation).toEqual({
      signal: {
        signalName: 'mock-signal',
        input: { data: Buffer.from('{"a":1}') },
      },
    });
  });

  it('leaves the signal input undefined when none is given', () => {
    const request = setup({
      body: {
        ...BASE_BODY,
        batchType: 'signal',
        signalParams: { signalName: 'mock-signal' },
      },
    });

    expect(request.operation).toEqual({
      signal: { signalName: 'mock-signal', input: undefined },
    });
  });

  it('only sets rps in the limits', () => {
    const request = setup({ body: { ...BASE_BODY, batchType: 'terminate' } });

    expect(request.limits).toEqual({ rps: 25 });
  });
});

function setup({ body }: { body: StartBatchActionRequestBody }) {
  return transformStartBatchActionBodyToGrpcInput({
    domain: 'mock-domain',
    batchId: 'mock-batch-id',
    identity: 'mock-user',
    body,
  });
}
