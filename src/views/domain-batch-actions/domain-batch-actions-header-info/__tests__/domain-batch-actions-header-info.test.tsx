import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type BatchAction } from '../../domain-batch-actions.types';
import DomainBatchActionHeaderInfo from '../domain-batch-actions-header-info';
import { type Props } from '../domain-batch-actions-header-info.types';

jest.mock(
  '../../domain-batch-actions-header-info-item/domain-batch-actions-header-info-item',
  () =>
    function MockItem({ title, content, loading, placeholderSize }: any) {
      return (
        <div>
          <span>title: {title}</span>
          {loading ? (
            <span>loading: {placeholderSize}</span>
          ) : (
            <span>content: {content}</span>
          )}
        </div>
      );
    }
);

jest.mock('../../config/domain-batch-actions-header-info-items.config', () => ({
  __esModule: true,
  default: [
    {
      title: 'Always',
      // Echoes the runtime context so we can assert it is threaded through.
      render: ({ batchAction, domain, cluster, workflowId }: any) =>
        `${batchAction.runId}/${domain}/${cluster}/${workflowId}`,
      placeholderSize: '10px',
    },
    {
      title: 'Conditional',
      hidden: ({ batchAction }: any) => batchAction.status === 'COMPLETED',
      render: () => 'conditional-content',
      placeholderSize: '20px',
    },
  ],
}));

const RUNNING_ACTION: BatchAction = { runId: '5', status: 'RUNNING' };

describe(DomainBatchActionHeaderInfo.name, () => {
  it('renders an item per config entry, threading runtime context into render', () => {
    setup({ batchAction: RUNNING_ACTION });

    expect(screen.getByText('title: Always')).toBeInTheDocument();
    expect(
      screen.getByText('content: 5/domain1/cluster1/workflow1')
    ).toBeInTheDocument();
  });

  it('omits items whose hidden predicate returns true', () => {
    setup({ batchAction: { runId: '5', status: 'COMPLETED' } });

    expect(screen.getByText('title: Always')).toBeInTheDocument();
    expect(screen.queryByText('title: Conditional')).not.toBeInTheDocument();
  });

  it('keeps items whose hidden predicate returns false', () => {
    setup({ batchAction: RUNNING_ACTION });

    expect(screen.getByText('title: Conditional')).toBeInTheDocument();
    expect(
      screen.getByText('content: conditional-content')
    ).toBeInTheDocument();
  });

  it('renders every item as a loading placeholder with no content when there is no batch action', () => {
    setup({ batchAction: undefined });

    // hidden filter is skipped without a batch action, so all items show.
    expect(screen.getByText('title: Always')).toBeInTheDocument();
    expect(screen.getByText('title: Conditional')).toBeInTheDocument();
    expect(screen.getByText('loading: 10px')).toBeInTheDocument();
    expect(screen.queryByText(/^content:/)).not.toBeInTheDocument();
  });

  it('renders items as loading placeholders when loading is true', () => {
    setup({ batchAction: RUNNING_ACTION, loading: true });

    expect(screen.getByText('title: Always')).toBeInTheDocument();
    expect(screen.getByText('loading: 10px')).toBeInTheDocument();
    expect(screen.queryByText(/^content:/)).not.toBeInTheDocument();
  });
});

function setup(props: Partial<Props> = {}) {
  render(
    <DomainBatchActionHeaderInfo
      domain="domain1"
      cluster="cluster1"
      workflowId="workflow1"
      {...props}
    />
  );
}
