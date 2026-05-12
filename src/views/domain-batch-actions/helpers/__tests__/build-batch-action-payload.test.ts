import buildBatchActionPayload from '../build-batch-action-payload';

describe('buildBatchActionPayload', () => {
  it('builds a payload with the basic fields and no SignalParams for non-signal actions', () => {
    expect(
      buildBatchActionPayload({
        domain: 'cadence-samples',
        query: 'WorkflowType="foo"',
        reason: 'cleanup',
        rps: 50,
        batchType: 'terminate',
      })
    ).toEqual({
      DomainName: 'cadence-samples',
      Query: 'WorkflowType="foo"',
      Reason: 'cleanup',
      BatchType: 'terminate',
      RPS: 50,
    });
  });

  it('includes SignalParams when batchType is signal', () => {
    const payload = buildBatchActionPayload({
      domain: 'cadence-samples',
      query: 'WorkflowType="foo"',
      reason: 'send signal',
      rps: 10,
      batchType: 'signal',
      signalParams: { signalName: 'mySignal', signalInput: '{"k":"v"}' },
    });

    expect(payload.SignalParams).toEqual({
      SignalName: 'mySignal',
      Input: '{"k":"v"}',
    });
  });

  it('omits SignalParams when batchType is signal but signalParams is missing', () => {
    const payload = buildBatchActionPayload({
      domain: 'cadence-samples',
      query: 'WorkflowType="foo"',
      reason: 'send signal',
      rps: 10,
      batchType: 'signal',
    });

    expect(payload.SignalParams).toBeUndefined();
  });
});
