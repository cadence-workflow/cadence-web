import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { getMockDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { formatScheduleDetails } from '@/views/shared/hooks/use-describe-schedule/format-schedule-details';
import { render, screen, waitFor, within } from '@/test-utils/rtl';

import ScheduleActionBackfillForm from '../schedule-action-backfill-form';
import { type BackfillScheduleFormData } from '../schedule-action-backfill-form.types';
import { backfillScheduleFormSchema } from '../schemas/backfill-schedule-form-schema';
import { USE_SCHEDULE_OVERLAP_POLICY } from '../schedule-action-backfill-form.constants';

const mockDatePicker = jest.fn(
  ({
    'aria-label': ariaLabel,
    minDate,
    maxDate,
  }: {
    'aria-label'?: string;
    minDate?: Date;
    maxDate?: Date;
  }) => (
    <input
      aria-label={ariaLabel}
      data-min-date={minDate?.toISOString()}
      data-max-date={maxDate?.toISOString()}
    />
  )
);

jest.mock('baseui/datepicker', () => ({
  DatePicker: (props: {
    'aria-label'?: string;
    minDate?: Date;
    maxDate?: Date;
  }) => mockDatePicker(props),
}));

describe(ScheduleActionBackfillForm.name, () => {
  it('renders backfill period and overlap policy fields', () => {
    setup();

    expect(screen.getByLabelText('Backfill ID')).toBeInTheDocument();
    expect(screen.getByText('Backfill period')).toBeInTheDocument();
    expect(screen.getByLabelText('Backfill period start')).toBeInTheDocument();
    expect(screen.getByLabelText('Backfill period end')).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /overlap policy/i })
    ).toBeInTheDocument();
  });

  it('shows start date validation error when end is before start', async () => {
    const { triggerValidation } = setup({
      defaultValues: {
        startTime: '2026-06-02T12:00:00.000Z',
        endTime: '2026-06-01T12:00:00.000Z',
        overlapPolicy: USE_SCHEDULE_OVERLAP_POLICY,
      },
    });

    await triggerValidation();

    const startPeriodField = screen.getByText('Start date').parentElement!;
    const endPeriodField = screen.getByText('End date').parentElement!;

    expect(
      await within(startPeriodField).findByText(
        'Start date must be before end date'
      )
    ).toBeInTheDocument();
    expect(
      within(endPeriodField).queryByText('Start date must be before end date')
    ).not.toBeInTheDocument();
  });

  it('shows required validation errors when dates are missing', async () => {
    const { triggerValidation } = setup();

    await triggerValidation();

    await waitFor(() => {
      expect(screen.getByText('Start date is required')).toBeInTheDocument();
      expect(screen.getByText('End date is required')).toBeInTheDocument();
    });
  });

  it('limits date pickers to schedule start and end when available', () => {
    setup({
      schedule: formatScheduleDetails(
        getMockDescribeScheduleResponse({
          spec: {
            cronExpression: '',
            startTime: { seconds: '1704067200', nanos: 0 },
            endTime: { seconds: '1706745600', nanos: 0 },
            jitter: null,
          },
        })
      ),
    });

    expect(
      screen.getByLabelText('Backfill period start')
    ).toHaveAttribute('data-min-date', '2024-01-01T00:00:00.000Z');
    expect(
      screen.getByLabelText('Backfill period start')
    ).toHaveAttribute('data-max-date', '2024-02-01T00:00:00.000Z');
    expect(screen.getByLabelText('Backfill period end')).toHaveAttribute(
      'data-min-date',
      '2024-01-01T00:00:00.000Z'
    );
    expect(screen.getByLabelText('Backfill period end')).toHaveAttribute(
      'data-max-date',
      '2024-02-01T00:00:00.000Z'
    );
  });
});

function setup({
  defaultValues,
  schedule,
}: {
  defaultValues?: BackfillScheduleFormData;
  schedule?: ReturnType<typeof formatScheduleDetails>;
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
      defaultValues: defaultValues ?? {},
    });

    triggerValidation = () => trigger(['startTime', 'endTime']);

    return (
      <ScheduleActionBackfillForm
        control={control}
        fieldErrors={fieldErrors}
        trigger={trigger}
        schedule={schedule}
        isSubmitted={isSubmitted}
      />
    );
  }

  render(<Wrapper />);

  return { triggerValidation: () => triggerValidation() };
}
