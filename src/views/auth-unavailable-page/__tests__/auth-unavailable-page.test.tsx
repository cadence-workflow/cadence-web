import { render, screen, within } from '@/test-utils/rtl';

import AuthUnavailablePage from '../auth-unavailable-page';

describe(AuthUnavailablePage.name, () => {
  it('renders the title as the page heading', () => {
    setup();

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Authentication infrastructure unavailable',
      })
    ).toBeInTheDocument();
  });

  it('explains the failure and what to do next', () => {
    setup();

    expect(
      screen.getByText(/authentication infrastructure is unavailable/)
    ).toBeInTheDocument();
    expect(screen.getByText(/not a permissions problem/)).toBeInTheDocument();
    expect(
      screen.getByText(/contact your Cadence deployment operator/)
    ).toBeInTheDocument();
  });

  it('shows the Cadence logo', () => {
    setup();

    expect(screen.getByRole('img', { name: 'Cadence' })).toBeInTheDocument();
  });

  it('puts all content in a single main landmark, since no parent layout provides one', () => {
    setup();

    const main = screen.getByRole('main');
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(within(main).getByRole('heading')).toBeInTheDocument();
    expect(within(main).getByRole('img')).toBeInTheDocument();
  });

  it('has nothing to interact with', () => {
    setup();

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});

function setup() {
  return render(<AuthUnavailablePage />);
}
