import getDescribeBatchActionQueryOptions from '../get-describe-batch-action-query-options';

const PARAMS = {
  domain: 'mock-domain',
  cluster: 'mock-cluster',
  workflowId: 'wf-1',
  runId: 'batch-1',
};

describe(getDescribeBatchActionQueryOptions.name, () => {
  it('builds the expected query key', () => {
    expect(getDescribeBatchActionQueryOptions(PARAMS)).toMatchObject({
      queryKey: ['describeBatchAction', PARAMS],
    });
  });

  it('does not set a refetch interval by default (one-shot fetch)', () => {
    expect(
      getDescribeBatchActionQueryOptions(PARAMS).refetchInterval
    ).toBeUndefined();
  });

  it('forwards react-query option overrides supplied by the consumer', () => {
    const refetchInterval = jest.fn();

    expect(
      getDescribeBatchActionQueryOptions({
        ...PARAMS,
        enabled: false,
        refetchInterval,
      })
    ).toMatchObject({ enabled: false, refetchInterval });
  });
});
