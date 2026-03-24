import { render, screen } from '@/test-utils/rtl';

import DomainWorkflowsArchivalList from '../domain-workflows-archival-list';

jest.mock('@/views/shared/workflows-list/workflows-list', () =>
  jest.fn(() => <div>Mock workflows list</div>)
);

describe(DomainWorkflowsArchivalList.name, () => {
  it('renders workflows list', () => {
    render(
      <DomainWorkflowsArchivalList
        domain="mock-domain"
        cluster="mock-cluster"
        timeRangeStart="mock-time-range-start"
        timeRangeEnd="mock-time-range-end"
      />
    );

    expect(screen.getByText('Mock workflows list')).toBeInTheDocument();
  });
});
