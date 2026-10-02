import { render, screen } from '@/test-utils/rtl';

import { mockScheduleActionsConfig } from '../../__fixtures__/schedule-actions-config';
import ScheduleActionsModal from '../schedule-actions-modal';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({ push: jest.fn() }),
}));

describe(ScheduleActionsModal.name, () => {
  it('does not render modal content when no action is selected', () => {
    render(
      <ScheduleActionsModal
        domain="mock-domain"
        cluster="mock-cluster"
        scheduleId="mock-schedule-id"
        action={undefined}
        onClose={jest.fn()}
      />
    );

    expect(screen.queryByText('Mock pause schedule')).not.toBeInTheDocument();
  });

  it('renders modal content when an action is selected', () => {
    render(
      <ScheduleActionsModal
        domain="mock-domain"
        cluster="mock-cluster"
        scheduleId="mock-schedule-id"
        action={mockScheduleActionsConfig[0]}
        onClose={jest.fn()}
      />,
      {
        endpointsMocks: [],
      }
    );

    expect(screen.getAllByText('Mock pause schedule').length).toBeGreaterThan(
      0
    );
  });
});
