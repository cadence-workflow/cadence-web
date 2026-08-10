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
      screen.getByLabelText('Backfill period start date/time')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Backfill period end date/time')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /overlap policy/i })
    ).toBeInTheDocument();
  });

  it('labels backfill period fields as date/time', () => {
    setup();

    expect(screen.getByText('Start date/time')).toBeInTheDocument();
    expect(screen.getByText('End date/time')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Backfill period start date/time')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Backfill period end date/time')
    ).toBeInTheDocument();
  });

  it('shows time picker when opening backfill period date pickers', async () => {
    const { user } = setup();

    await user.click(screen.getByLabelText('Backfill period start date/time'));
    expect(screen.getByText('Start time')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Backfill period end date/time'));
    expect(screen.getAllByText('Start time').length).toBeGreaterThanOrEqual(1);
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
