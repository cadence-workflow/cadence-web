import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { mockDomainSchedulesCreateFormData } from '../../domain-schedules-create-modal/__fixtures__/mock-domain-schedules-create-form-data';
import { type DomainSchedulesCreateFormData } from '../../domain-schedules-create-modal/domain-schedules-create-modal.types';
import { createScheduleFormSchema } from '../../domain-schedules-create-modal/schemas/create-schedule-form-schema';
import DomainSchedulesCreateAdvancedForm from '../domain-schedules-create-advanced-form';

jest.mock(
  '@/views/shared/hooks/use-search-attributes/use-search-attributes',
  () =>
    jest.fn(() => ({
      data: {
        keys: {
          CustomKeywordField: 'INDEXED_VALUE_TYPE_STRING',
          CustomIntField: 'INDEXED_VALUE_TYPE_INT',
        },
      },
      isLoading: false,
    }))
);

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
    expect(screen.getByText('Start date')).toBeInTheDocument();
    expect(screen.getByText('End date')).toBeInTheDocument();
    expect(screen.getByLabelText('Memo')).toBeInTheDocument();
    expect(screen.getByLabelText('Search attribute key')).toBeInTheDocument();
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

  it('clears schedule id and workflow id prefix when inputs are emptied', async () => {
    const { user, getValues } = setup();

    await user.click(
      screen.getByRole('button', { name: /show advanced configurations/i })
    );

    const scheduleId = screen.getByLabelText('Schedule Id');
    await user.type(scheduleId, 'my-schedule');
    await user.clear(scheduleId);
    expect(getValues().scheduleId).toBeUndefined();

    const workflowIdPrefix = screen.getByLabelText('Workflow Id Prefix');
    await user.type(workflowIdPrefix, 'prefix');
    await user.clear(workflowIdPrefix);
    expect(getValues().workflowIdPrefix).toBeUndefined();
  });

  it('shows end date error when start is not before end', async () => {
    const user = userEvent.setup();

    function Wrapper() {
      const {
        control,
        trigger,
        formState: { errors: fieldErrors, isSubmitted },
      } = useForm<DomainSchedulesCreateFormData>({
        resolver: zodResolver(createScheduleFormSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
          ...mockDomainSchedulesCreateFormData,
          startTime: '2026-06-30T12:00:00.000Z',
          endTime: '2026-06-23T12:00:00.000Z',
        },
      });

      return (
        <>
          <DomainSchedulesCreateAdvancedForm
            control={control}
            fieldErrors={fieldErrors}
            trigger={trigger}
            isSubmitted={isSubmitted}
            cluster="test-cluster"
          />
          <button type="button" onClick={() => trigger()}>
            Validate
          </button>
        </>
      );
    }

    render(<Wrapper />);

    await user.click(
      screen.getByRole('button', { name: /show advanced configurations/i })
    );
    await user.click(screen.getByRole('button', { name: 'Validate' }));

    expect(
      await screen.findByText('Start date must be before end date')
    ).toBeInTheDocument();
  });
});

function setup() {
  const user = userEvent.setup();
  let getValues: () => DomainSchedulesCreateFormData;

  function Wrapper() {
    const {
      control,
      getValues: readValues,
      formState: { errors: fieldErrors },
    } = useForm<DomainSchedulesCreateFormData>({
      defaultValues: {},
    });
    getValues = readValues;

    return (
      <DomainSchedulesCreateAdvancedForm
        control={control}
        fieldErrors={fieldErrors}
        cluster="test-cluster"
      />
    );
  }

  render(<Wrapper />);
  return { user, getValues: () => getValues() };
}
