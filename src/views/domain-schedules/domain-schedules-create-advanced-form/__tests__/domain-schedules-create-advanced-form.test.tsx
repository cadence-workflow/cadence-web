import React from 'react';

import { useForm } from 'react-hook-form';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { type DomainSchedulesCreateFormData } from '../../domain-schedules-create-modal/domain-schedules-create-modal.types';
import DomainSchedulesCreateAdvancedForm from '../domain-schedules-create-advanced-form';

describe(DomainSchedulesCreateAdvancedForm.name, () => {
  it('renders the accordion toggle and is collapsed by default', () => {
    setup();

    expect(
      screen.getByRole('button', { name: /show advanced configurations/i })
    ).toBeInTheDocument();
    expect(screen.queryByLabelText('Schedule Id')).not.toBeInTheDocument();
  });

  it('expands advanced fields when the toggle is clicked', async () => {
    const { user } = setup();

    await user.click(
      screen.getByRole('button', { name: /show advanced configurations/i })
    );

    expect(
      screen.getByRole('button', { name: /hide advanced configurations/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Schedule Id')).toBeInTheDocument();
    expect(screen.getByLabelText('Jitter duration')).toBeInTheDocument();
    expect(screen.getByLabelText('Workflow Id Prefix')).toBeInTheDocument();
    expect(screen.getByLabelText('Schedule period start')).toBeInTheDocument();
    expect(screen.getByLabelText('Schedule period end')).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /overlap policy/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('radiogroup', { name: /catch-up policy/i })
    ).toBeInTheDocument();
  });

  it('collapses advanced fields when the toggle is clicked again', async () => {
    const { user } = setup();

    await user.click(
      screen.getByRole('button', { name: /show advanced configurations/i })
    );
    expect(screen.getByLabelText('Schedule Id')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /hide advanced configurations/i })
    );
    expect(
      screen.getByRole('button', { name: /show advanced configurations/i })
    ).toBeInTheDocument();
  });

  it('shows buffer limit only when overlap policy is Buffer', async () => {
    const { user } = setup();

    await user.click(
      screen.getByRole('button', { name: /show advanced configurations/i })
    );

    const overlapPolicy = screen.getByRole('combobox', {
      name: /overlap policy/i,
    });
    await user.click(overlapPolicy);
    await user.click(screen.getByText('Buffer'));

    expect(screen.getByLabelText('Buffer limit')).toBeInTheDocument();
    expect(
      screen.queryByLabelText('Concurrency limit')
    ).not.toBeInTheDocument();
  });

  it('shows concurrency limit only when overlap policy is Concurrent', async () => {
    const { user } = setup();

    await user.click(
      screen.getByRole('button', { name: /show advanced configurations/i })
    );

    expect(screen.getByLabelText('Concurrency limit')).toBeInTheDocument();
    expect(screen.queryByLabelText('Buffer limit')).not.toBeInTheDocument();
  });

  it('shows catch-up window only when catch-up policy is not Skip', async () => {
    const { user } = setup();

    await user.click(
      screen.getByRole('button', { name: /show advanced configurations/i })
    );

    expect(screen.queryByLabelText('Catch-up window')).not.toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'Catch-up all' }));
    expect(screen.getByLabelText('Catch-up window')).toBeInTheDocument();
  });

  it('hides catch-up window when switching catch-up policy back to Skip', async () => {
    const { user } = setup();

    await user.click(
      screen.getByRole('button', { name: /show advanced configurations/i })
    );

    await user.click(screen.getByRole('radio', { name: 'Catch-up all' }));
    expect(screen.getByLabelText('Catch-up window')).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'Skip' }));
    expect(screen.queryByLabelText('Catch-up window')).not.toBeInTheDocument();
  });
});

function setup() {
  const user = userEvent.setup();

  function Wrapper() {
    const {
      control,
      formState: { errors: fieldErrors },
    } = useForm<DomainSchedulesCreateFormData>({
      defaultValues: {},
    });

    return (
      <DomainSchedulesCreateAdvancedForm
        control={control}
        fieldErrors={fieldErrors}
      />
    );
  }

  render(<Wrapper />);
  return { user };
}
