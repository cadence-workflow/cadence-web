import { render, screen, userEvent } from '@/test-utils/rtl';

import DomainSchedulesCreateSuccessMsg from '../domain-schedules-create-success-msg';

describe('DomainSchedulesCreateSuccessMsg', () => {
  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the success message with a link', () => {
    render(
      <DomainSchedulesCreateSuccessMsg
        domain="test-domain"
        cluster="test-cluster"
        scheduleId="test-schedule-id"
        onDismissMessage={mockOnDismiss}
      />
    );

    expect(screen.getByText(/Schedule has been created/)).toBeInTheDocument();
    expect(screen.getByText('Click here')).toBeInTheDocument();
    expect(screen.getByText(/to view the new schedule[.]/)).toBeInTheDocument();
  });

  it('renders the link with the correct href', () => {
    render(
      <DomainSchedulesCreateSuccessMsg
        domain="test-domain"
        cluster="test-cluster"
        scheduleId="test-schedule-id"
        onDismissMessage={mockOnDismiss}
      />
    );

    const link = screen.getByText('Click here');
    expect(link).toHaveAttribute(
      'href',
      '/domains/test-domain/test-cluster/schedules/test-schedule-id/details'
    );
  });

  it('calls onDismissMessage when the link is clicked', async () => {
    const user = userEvent.setup();
    render(
      <DomainSchedulesCreateSuccessMsg
        domain="test-domain"
        cluster="test-cluster"
        scheduleId="test-schedule-id"
        onDismissMessage={mockOnDismiss}
      />
    );

    await user.click(screen.getByText('Click here'));
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });
});
