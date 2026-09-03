import { render, screen } from '@/test-utils/rtl';

import DomainsPageTitleBadge from '../domains-page-title-badge';
import { type Props } from '../domains-page-title-badge.types';

jest.mock('baseui/skeleton', () => ({
  Skeleton: jest.fn(() => <div data-testid="skeleton" />),
}));

describe(DomainsPageTitleBadge.name, () => {
  it('renders a skeleton and no badge text while loading', () => {
    setup({ isLoading: true });

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    expect(screen.queryByText('3')).not.toBeInTheDocument();
  });

  it('renders "X of Y+" when the list is narrowed and more pages remain', () => {
    setup({ count: 1, totalCount: 3, hasNextPage: true });

    expect(screen.getByText('1 of 3+')).toBeInTheDocument();
  });

  it('renders the plain total when nothing narrows the list', () => {
    setup({ count: 3, totalCount: 3, hasNextPage: false });

    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

function setup(overrides: Partial<Props>) {
  const defaultProps: Props = {
    count: 0,
    totalCount: 0,
    isLoading: false,
    hasNextPage: false,
  };

  render(<DomainsPageTitleBadge {...defaultProps} {...overrides} />);
}
