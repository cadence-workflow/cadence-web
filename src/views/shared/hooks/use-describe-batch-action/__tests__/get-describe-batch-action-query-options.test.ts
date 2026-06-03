import { type BatchAction } from '@/views/domain-batch-actions/domain-batch-actions.types';

import getDescribeBatchActionQueryOptions from '../get-describe-batch-action-query-options';
import { DESCRIBE_BATCH_ACTION_REFETCH_INTERVAL } from '../use-describe-batch-action.constants';
import { type UseDescribeBatchActionParams } from '../use-describe-batch-action.types';

const PARAMS = {
  domain: 'mock-domain',
  cluster: 'mock-cluster',
  batchActionId: 'batch-1',
};

describe(getDescribeBatchActionQueryOptions.name, () => {
  it('builds the expected query key', () => {
    expect(getDescribeBatchActionQueryOptions(PARAMS)).toMatchObject({
      queryKey: ['describeBatchAction', PARAMS],
    });
  });

  it('polls at the default interval while the batch action is RUNNING', () => {
    expect(getRefetchInterval({ status: 'RUNNING' })).toBe(
      DESCRIBE_BATCH_ACTION_REFETCH_INTERVAL
    );
  });

  it('honours a custom refetchInterval override while RUNNING', () => {
    expect(
      getRefetchInterval({ status: 'RUNNING' }, { refetchInterval: 500 })
    ).toBe(500);
  });

  it.each(['COMPLETED', 'FAILED', 'ABORTED'] as const)(
    'stops polling once the batch action is %s',
    (status) => {
      expect(getRefetchInterval({ status })).toBe(false);
    }
  );

  it('does not poll before any data has been fetched', () => {
    expect(getRefetchInterval(undefined)).toBe(false);
  });
});

function getRefetchInterval(
  data: Partial<BatchAction> | undefined,
  overrides: Partial<UseDescribeBatchActionParams> = {}
) {
  const refetchInterval = getDescribeBatchActionQueryOptions({
    ...PARAMS,
    ...overrides,
  }).refetchInterval as unknown as (query: {
    state: { data?: BatchAction };
  }) => number | false;

  return refetchInterval({ state: { data: data as BatchAction | undefined } });
}
