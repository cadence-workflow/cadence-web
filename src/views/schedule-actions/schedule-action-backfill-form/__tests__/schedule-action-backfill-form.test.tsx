import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { render, screen, userEvent } from '@/test-utils/rtl';

import ScheduleActionBackfillForm from '../schedule-action-backfill-form';
import { type BackfillScheduleFormData } from '../schedule-action-backfill-form.types';
import { backfillScheduleFormSchema } from '../schemas/backfill-schedule-form-schema';

describe(ScheduleActionBackfillForm.name, () => {
  it('renders backfill period and overlap policy fields', () => {
    setup();

    expect(screen.getByLabelText('Backfill ID')).toBeInTheDocument();
    expect(screen.getByText('Backfill period')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Backfill period start')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Backfill period end')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /overlap policy/i })
    ).toBeInTheDocument();
  });

  it('shows time picker when opening backfill period date pickers', async () => {
    const { user } = setup();

    await user.click(screen.getByLabelText('Backfill period start'));
    expect(
      screen
        .getAllByText('Start time')
        .some((el) => el.getAttribute('data-baseweb') === 'form-control-label')
    ).toBe(true);
    expect(
      document.querySelector('[data-baseweb="popover"]')?.querySelectorAll('[role="combobox"]').length
    ).toBeGreaterThan(0);

    await user.keyboard('{Escape}');
    await user.click(screen.getByLabelText('Backfill period end'));
    expect(
      screen
        .getAllByText('End time')
        .some((el) => el.getAttribute('data-baseweb') === 'form-control-label')
    ).toBe(true);
    expect(
      document.querySelector('[data-baseweb="popover"]')?.querySelectorAll('[role="combobox"]').length
    ).toBeGreaterThan(0);
  });
});

function setup({
  defaultValues,
}: {
  defaultValues?: BackfillScheduleFormData;
} = {}) {
  let triggerValidation: () => Promise<boolean> = async () => true;
  const user = userEvent.setup();

  function Wrapper() {
    const {
      control,
      formState: { errors: fieldErrors, isSubmitted },
      trigger,
    } = useForm<BackfillScheduleFormData>({
      resolver: zodResolver(backfillScheduleFormSchema),
      mode: 'onChange',
      defaultValues: defaultValues ?? {},
    });

    triggerValidation = () => trigger(['startTime', 'endTime']);

    return (
      <ScheduleActionBackfillForm
        control={control}
        fieldErrors={fieldErrors}
        trigger={trigger}
        isSubmitted={isSubmitted}
      />
    );
  }

  render(<Wrapper />);

  return { triggerValidation: () => triggerValidation(), user };
}
