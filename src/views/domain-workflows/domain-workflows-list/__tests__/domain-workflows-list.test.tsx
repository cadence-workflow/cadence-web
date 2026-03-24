import { render, screen } from '@/test-utils/rtl';

import DomainWorkflowsList from '../domain-workflows-list';

jest.mock('@/views/shared/workflows-list/workflows-list', () =>
  jest.fn(() => <div>Mock workflows list</div>)
);

describe(DomainWorkflowsList.name, () => {
  it('renders workflows list', () => {
    render(
      <DomainWorkflowsList
        domain="mock-domain"
        cluster="mock-cluster"
        timeRangeEnd="mock-time-range-end"
      />
    );

    expect(screen.getByText('Mock workflows list')).toBeInTheDocument();
  });
});
