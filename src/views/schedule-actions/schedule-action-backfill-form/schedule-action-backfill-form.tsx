import { DatePicker } from 'baseui/datepicker';
import { FormControl } from 'baseui/form-control';
import { Select } from 'baseui/select';
import { Controller } from 'react-hook-form';

import DomainSchedulesHorizontalField from '@/views/domain-schedules/domain-schedules-horizontal-field/domain-schedules-horizontal-field';
import getFieldErrorMessage from '@/views/workflow-actions/workflow-action-start-form/helpers/get-field-error-message';

import {
  BACKFILL_OVERLAP_POLICY_OPTIONS,
  BACKFILL_SCHEDULE_FORM_FIELD_DESCRIPTIONS,
  DEFAULT_BACKFILL_OVERLAP_POLICY,
  SCHEDULE_ACTION_BACKFILL_FORM_FIELD_IDS,
} from './schedule-action-backfill-form.constants';
import { overrides, styled } from './schedule-action-backfill-form.styles';
import { type Props } from './schedule-action-backfill-form.types';

export default function ScheduleActionBackfillForm({
  fieldErrors,
  control,
  trigger,
  isSubmitted = false,
}: Props) {
  const startTimeErrorMessage = getFieldErrorMessage(fieldErrors, 'startTime');
  const endTimeErrorMessage = getFieldErrorMessage(fieldErrors, 'endTime');

  const revalidateBackfillPeriod = () => {
    if (isSubmitted) {
      void trigger?.(['startTime', 'endTime']);
    }
  };

  return (
    <>
      <DomainSchedulesHorizontalField
        label="Backfill period"
        description={BACKFILL_SCHEDULE_FORM_FIELD_DESCRIPTIONS.period}
      >
        <styled.SchedulePeriodRow>
          <styled.SchedulePeriodField>
            <styled.SchedulePeriodInputLabel
              htmlFor={SCHEDULE_ACTION_BACKFILL_FORM_FIELD_IDS.startTime}
            >
              Start date
            </styled.SchedulePeriodInputLabel>
            <FormControl
              error={startTimeErrorMessage}
              overrides={overrides.schedulePeriodFormControl}
            >
              <Controller
                name="startTime"
                control={control}
                render={({ field: { value, onChange, ref, ...field } }) => (
                  <DatePicker
                    {...field}
                    // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                    inputRef={ref}
                    id={SCHEDULE_ACTION_BACKFILL_FORM_FIELD_IDS.startTime}
                    aria-label="Backfill period start"
                    value={value ? [new Date(value)] : []}
                    onChange={({ date }) => {
                      const d = Array.isArray(date) ? date[0] : date;
                      if (d) {
                        onChange(d.toISOString());
                      } else {
                        onChange(undefined);
                      }
                      revalidateBackfillPeriod();
                    }}
                    error={Boolean(startTimeErrorMessage)}
                    size="compact"
                    timeSelectStart
                    formatString="yyyy/MM/dd HH:mm"
                    clearable
                  />
                )}
              />
            </FormControl>
          </styled.SchedulePeriodField>

          <styled.SchedulePeriodField>
            <styled.SchedulePeriodInputLabel
              htmlFor={SCHEDULE_ACTION_BACKFILL_FORM_FIELD_IDS.endTime}
            >
              End date
            </styled.SchedulePeriodInputLabel>
            <FormControl
              error={endTimeErrorMessage}
              overrides={overrides.schedulePeriodFormControl}
            >
              <Controller
                name="endTime"
                control={control}
                render={({ field: { value, onChange, ref, ...field } }) => (
                  <DatePicker
                    {...field}
                    // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                    inputRef={ref}
                    id={SCHEDULE_ACTION_BACKFILL_FORM_FIELD_IDS.endTime}
                    aria-label="Backfill period end"
                    value={value ? [new Date(value)] : []}
                    onChange={({ date }) => {
                      const d = Array.isArray(date) ? date[0] : date;
                      if (d) {
                        onChange(d.toISOString());
                      } else {
                        onChange(undefined);
                      }
                      revalidateBackfillPeriod();
                    }}
                    error={Boolean(endTimeErrorMessage)}
                    size="compact"
                    timeSelectStart
                    formatString="yyyy/MM/dd HH:mm"
                    clearable
                  />
                )}
              />
            </FormControl>
          </styled.SchedulePeriodField>
        </styled.SchedulePeriodRow>
      </DomainSchedulesHorizontalField>

      <DomainSchedulesHorizontalField
        label="Overlap policy"
        description={BACKFILL_SCHEDULE_FORM_FIELD_DESCRIPTIONS.overlapPolicy}
        error={getFieldErrorMessage(fieldErrors, 'overlapPolicy')}
      >
        <Controller
          name="overlapPolicy"
          control={control}
          defaultValue={DEFAULT_BACKFILL_OVERLAP_POLICY}
          render={({ field: { value, onChange, ref, ...field } }) => (
            <Select
              {...field}
              inputRef={ref}
              aria-label="Overlap policy"
              options={BACKFILL_OVERLAP_POLICY_OPTIONS}
              value={value ? [{ id: value }] : []}
              onChange={(params) => {
                onChange(params.value[0]?.id);
              }}
              error={Boolean(
                getFieldErrorMessage(fieldErrors, 'overlapPolicy')
              )}
              size="compact"
              clearable={false}
            />
          )}
        />
      </DomainSchedulesHorizontalField>
    </>
  );
}
