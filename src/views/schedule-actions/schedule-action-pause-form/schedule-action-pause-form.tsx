import { Textarea } from 'baseui/textarea';
import { Controller } from 'react-hook-form';

import DomainSchedulesHorizontalField from '@/views/domain-schedules/domain-schedules-horizontal-field/domain-schedules-horizontal-field';
import getFieldErrorMessage from '@/views/workflow-actions/workflow-action-start-form/helpers/get-field-error-message';

import { SCHEDULE_ACTION_PAUSE_FORM_FIELD_IDS } from './schedule-action-pause-form.constants';
import { type Props } from './schedule-action-pause-form.types';

export default function ScheduleActionPauseForm({
  fieldErrors,
  control,
}: Props) {
  return (
    <DomainSchedulesHorizontalField
      label="Reason for pausing"
      htmlFor={SCHEDULE_ACTION_PAUSE_FORM_FIELD_IDS.reason}
      error={getFieldErrorMessage(fieldErrors, 'reason')}
    >
      <Controller
        name="reason"
        control={control}
        defaultValue=""
        render={({ field: { ref, ...field } }) => (
          <Textarea
            {...field}
            id={SCHEDULE_ACTION_PAUSE_FORM_FIELD_IDS.reason}
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
  );
}
