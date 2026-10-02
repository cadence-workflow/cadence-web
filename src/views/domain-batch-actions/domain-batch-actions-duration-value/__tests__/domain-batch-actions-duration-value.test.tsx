import { render, screen, act } from '@/test-utils/rtl';

import { type BatchAction } from '../../domain-batch-actions.types';
import DomainBatchActionDurationValue from '../domain-batch-actions-duration-value';

jest.useFakeTimers().setSystemTime(new Date('2024-01-01T00:00:10Z'));

const START = new Date('2024-01-01T00:00:00Z').getTime();

describe(DomainBatchActionDurationValue.name, () => {
  it('renders a dash when there is no start time', () => {
    setup({ status: 'RUNNING' });
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders a static duration for a completed action', () => {
    setup({
      status: 'COMPLETED',
      startTime: START,
      endTime: START + 5000,
    });
    expect(screen.getByText('5s')).toBeInTheDocument();
  });

  it('ticks the duration live while running', () => {
    setup({ status: 'RUNNING', startTime: START });
    // now (00:00:10) - start (00:00:00) = 10s
    expect(screen.getByText('10s')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('11s')).toBeInTheDocument();
  });
});

function setup(
  batchAction: Partial<BatchAction> & { status: BatchAction['status'] }
) {
  render(
    <DomainBatchActionDurationValue
      batchAction={{ runId: 'run-1', ...batchAction }}
    />
  );
}
