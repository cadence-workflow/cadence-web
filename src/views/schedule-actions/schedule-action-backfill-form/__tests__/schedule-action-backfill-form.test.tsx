import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { render, screen, waitFor } from '@/test-utils/rtl';

import { DEFAULT_BACKFILL_OVERLAP_POLICY } from '../schedule-action-backfill-form.constants';
import ScheduleActionBackfillForm from '../schedule-action-backfill-form';
import { type BackfillScheduleFormData } from '../schedule-action-backfill-form.types';
import { backfillScheduleFormSchema } from '../schemas/backfill-schedule-form-schema';

describe(ScheduleActionBackfillForm.name, () => {
  it('renders backfill period and overlap policy fields', () => {
    setup();

    expect(screen.getByText('Backfill period')).toBeInTheDocument();
    expect(screen.getByLabelText('Backfill period start')).toBeInTheDocument();
    expect(screen.getByLabelText('Backfill period end')).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /overlap policy/i })
    ).toBeInTheDocument();
  });

  it('shows end date validation error when end is before start', async () => {
    const { triggerValidation } = setup({
      defaultValues: {
        startTime: '2026-06-02T12:00:00.000Z',
        endTime: '2026-06-01T12:00:00.000Z',
        overlapPolicy: DEFAULT_BACKFILL_OVERLAP_POLICY,
      },
    });

    await triggerValidation();

    expect(
      await screen.findByText('Start date must be before end date')
    ).toBeInTheDocument();
  });

  it('shows required validation errors when dates are missing', async () => {
    const { triggerValidation } = setup();

    await triggerValidation();

    await waitFor(() => {
      expect(screen.getByText('Start date is required')).toBeInTheDocument();
      expect(screen.getByText('End date is required')).toBeInTheDocument();
    });
  });
});

function setup({
  defaultValues,
}: {
  defaultValues?: BackfillScheduleFormData;
} = {}) {
  let triggerValidation: () => Promise<boolean> = async () => true;

  function Wrapper() {
    const {
      control,
      formState: { errors: fieldErrors, isSubmitted },
      trigger,
    } = useForm<BackfillScheduleFormData>({
      resolver: zodResolver(backfillScheduleFormSchema),
      mode: 'onChange',
      defaultValues: defaultValues ?? {
        overlapPolicy: DEFAULT_BACKFILL_OVERLAP_POLICY,
      },
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

  return { triggerValidation: () => triggerValidation() };
}
