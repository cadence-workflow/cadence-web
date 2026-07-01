import { Radio, RadioGroup } from 'baseui/radio';
import { Textarea } from 'baseui/textarea';
import { Controller } from 'react-hook-form';

import DomainSchedulesHorizontalField from '@/views/domain-schedules/domain-schedules-horizontal-field/domain-schedules-horizontal-field';
import { RESUME_SCHEDULE_FORM_FIELD_DESCRIPTIONS } from '@/views/schedule-actions/config/schedule-actions.constants';
import getFieldErrorMessage from '@/views/workflow-actions/workflow-action-start-form/helpers/get-field-error-message';

import {
  DEFAULT_RESUME_CATCH_UP_POLICY,
  RESUME_CATCH_UP_POLICY_OPTIONS,
  SCHEDULE_ACTION_RESUME_FORM_FIELD_IDS,
} from './schedule-action-resume-form.constants';
import { type Props } from './schedule-action-resume-form.types';

export default function ScheduleActionResumeForm({
  fieldErrors,
  control,
}: Props) {
  return (
    <>
      <DomainSchedulesHorizontalField
        label="Catch-up policy"
        description={RESUME_SCHEDULE_FORM_FIELD_DESCRIPTIONS.catchUpPolicy}
        error={getFieldErrorMessage(fieldErrors, 'catchUpPolicy')}
      >
        <Controller
          name="catchUpPolicy"
          control={control}
          defaultValue={DEFAULT_RESUME_CATCH_UP_POLICY}
          render={({ field: { value, onChange, ref, ...field } }) => (
            <RadioGroup
              {...field}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              aria-label="Catch-up policy"
              value={value}
              onChange={(e) => onChange(e.currentTarget.value)}
              error={Boolean(
                getFieldErrorMessage(fieldErrors, 'catchUpPolicy')
              )}
            >
              {RESUME_CATCH_UP_POLICY_OPTIONS.map((option) => (
                <Radio key={option.id} value={option.id}>
                  {option.label}
                </Radio>
              ))}
            </RadioGroup>
          )}
        />
      </DomainSchedulesHorizontalField>

      <DomainSchedulesHorizontalField
        label="Reason for resuming (optional)"
        description={RESUME_SCHEDULE_FORM_FIELD_DESCRIPTIONS.reason}
        htmlFor={SCHEDULE_ACTION_RESUME_FORM_FIELD_IDS.reason}
        error={getFieldErrorMessage(fieldErrors, 'reason')}
      >
        <Controller
          name="reason"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...field } }) => (
            <Textarea
              {...field}
              id={SCHEDULE_ACTION_RESUME_FORM_FIELD_IDS.reason}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              size="compact"
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              onBlur={field.onBlur}
              error={Boolean(getFieldErrorMessage(fieldErrors, 'reason'))}
              placeholder="Add reason"
            />
          )}
        />
      </DomainSchedulesHorizontalField>
    </>
  );
}
