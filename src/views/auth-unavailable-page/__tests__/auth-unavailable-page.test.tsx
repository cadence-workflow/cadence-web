import { render, screen } from '@/test-utils/rtl';

import AuthUnavailablePage from '../auth-unavailable-page';

describe(AuthUnavailablePage.name, () => {
  it('renders the status copy', () => {
    render(<AuthUnavailablePage />);

    expect(
      screen.getByText('Authentication infrastructure unavailable')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/contact your Cadence deployment operator/)
    ).toBeInTheDocument();
  });
});
