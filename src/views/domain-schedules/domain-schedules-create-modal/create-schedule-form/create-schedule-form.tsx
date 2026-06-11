'use client';

import React from 'react';

import { Checkbox } from 'baseui/checkbox';
import { Input } from 'baseui/input';
import { LabelXSmall } from 'baseui/typography';
import { Controller, useFormState } from 'react-hook-form';

import CronScheduleInput from '@/components/cron-schedule-input/cron-schedule-input';
import DomainSchedulesHorizontalField from '@/views/domain-schedules/domain-schedules-horizontal-field/domain-schedules-horizontal-field';
import getFieldErrorMessage from '@/views/workflow-actions/workflow-action-start-form/helpers/get-field-error-message';
import getFieldObjectErrorMessages from '@/views/workflow-actions/workflow-action-start-form/helpers/get-field-object-error-messages';

import {
  CREATE_SCHEDULE_FORM_FIELD_IDS,
  CREATE_SCHEDULE_MAIN_FIELD_DESCRIPTIONS,
} from './create-schedule-form.constants';
import { overrides } from './create-schedule-form.styles';
import { type Props } from './create-schedule-form.types';

export default function CreateScheduleForm({ control, trigger }: Props) {
  const { errors: fieldErrors, isSubmitted } = useFormState({ control });
  // TODO: move getFieldObjectErrorMessages to a common helper
  const cronExpressionError = getFieldObjectErrorMessages(
    fieldErrors,
    'cronExpression'
  );
  const cronExpressionErrorMessage =
    typeof cronExpressionError === 'string'
      ? cronExpressionError
      : cronExpressionError?.general;

  return (
    <div>
      <DomainSchedulesHorizontalField
        label="Workflow Type"
        description={CREATE_SCHEDULE_MAIN_FIELD_DESCRIPTIONS.workflowType}
        htmlFor={CREATE_SCHEDULE_FORM_FIELD_IDS.workflowType}
        error={getFieldErrorMessage(fieldErrors, 'workflowType.name')}
      >
        <Controller
          name="workflowType.name"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              id={CREATE_SCHEDULE_FORM_FIELD_IDS.workflowType}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              aria-label="Workflow Type"
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              error={Boolean(
                getFieldErrorMessage(fieldErrors, 'workflowType.name')
              )}
              size="compact"
              placeholder="Enter workflow type name"
            />
          )}
        />
      </DomainSchedulesHorizontalField>

      <DomainSchedulesHorizontalField
        label="Cron Expression (UTC)"
        description={CREATE_SCHEDULE_MAIN_FIELD_DESCRIPTIONS.cronExpression}
        error={cronExpressionErrorMessage}
      >
        <Controller
          name="cronExpression"
          control={control}
          render={({ field }) => (
            <CronScheduleInput
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                // If form is submitted, trigger the validation to show fix immediately
                if (isSubmitted) trigger('cronExpression');
              }}
              onBlur={field.onBlur}
              error={cronExpressionError}
            />
          )}
        />
      </DomainSchedulesHorizontalField>

      <DomainSchedulesHorizontalField
        label="Task List"
        description={CREATE_SCHEDULE_MAIN_FIELD_DESCRIPTIONS.taskList}
        htmlFor={CREATE_SCHEDULE_FORM_FIELD_IDS.taskList}
        error={getFieldErrorMessage(fieldErrors, 'taskList.name')}
      >
        <Controller
          name="taskList.name"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              id={CREATE_SCHEDULE_FORM_FIELD_IDS.taskList}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              aria-label="Task List"
              onChange={(e) => field.onChange(e.target.value.trim())}
              onBlur={field.onBlur}
              error={Boolean(
                getFieldErrorMessage(fieldErrors, 'taskList.name')
              )}
              size="compact"
              placeholder="Enter task list name"
            />
          )}
        />
      </DomainSchedulesHorizontalField>

      <DomainSchedulesHorizontalField
        label="Execution Start-to-Close Timeout"
        description={
          CREATE_SCHEDULE_MAIN_FIELD_DESCRIPTIONS.executionStartToCloseTimeout
        }
        htmlFor={CREATE_SCHEDULE_FORM_FIELD_IDS.executionStartToCloseTimeout}
        error={getFieldErrorMessage(
          fieldErrors,
          'executionStartToCloseTimeoutSeconds'
        )}
      >
        <Controller
          name="executionStartToCloseTimeoutSeconds"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              id={CREATE_SCHEDULE_FORM_FIELD_IDS.executionStartToCloseTimeout}
              value={field.value ?? ''}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              aria-label="Execution Start-to-Close Timeout"
              type="number"
              min={1}
              onChange={(e) =>
                field.onChange(
                  e.target.value ? parseInt(e.target.value, 10) : undefined
                )
              }
              onBlur={field.onBlur}
              error={Boolean(
                getFieldErrorMessage(
                  fieldErrors,
                  'executionStartToCloseTimeoutSeconds'
                )
              )}
              size="compact"
              placeholder="Enter timeout in seconds"
              endEnhancer={<LabelXSmall>Seconds</LabelXSmall>}
            />
          )}
        />
      </DomainSchedulesHorizontalField>

      <DomainSchedulesHorizontalField
        label="Task Start-to-Close Timeout"
        description={
          CREATE_SCHEDULE_MAIN_FIELD_DESCRIPTIONS.taskStartToCloseTimeout
        }
        htmlFor={CREATE_SCHEDULE_FORM_FIELD_IDS.taskStartToCloseTimeout}
        error={getFieldErrorMessage(
          fieldErrors,
          'taskStartToCloseTimeoutSeconds'
        )}
      >
        <Controller
          name="taskStartToCloseTimeoutSeconds"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              id={CREATE_SCHEDULE_FORM_FIELD_IDS.taskStartToCloseTimeout}
              value={field.value ?? ''}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              aria-label="Task Start-to-Close Timeout"
              type="number"
              min={1}
              onChange={(e) =>
                field.onChange(
                  e.target.value ? parseInt(e.target.value, 10) : undefined
                )
              }
              onBlur={field.onBlur}
              error={Boolean(
                getFieldErrorMessage(
                  fieldErrors,
                  'taskStartToCloseTimeoutSeconds'
                )
              )}
              size="compact"
              placeholder="Enter timeout in seconds"
              endEnhancer={<LabelXSmall>Seconds</LabelXSmall>}
            />
          )}
        />
      </DomainSchedulesHorizontalField>

      <DomainSchedulesHorizontalField
        label="Pause on failure"
        description={CREATE_SCHEDULE_MAIN_FIELD_DESCRIPTIONS.pauseOnFailure}
        htmlFor={CREATE_SCHEDULE_FORM_FIELD_IDS.pauseOnFailure}
      >
        <Controller
          name="pauseOnFailure"
          control={control}
          defaultValue={false}
          render={({ field: { value, onChange, ref, ...field } }) => (
            <Checkbox
              {...field}
              id={CREATE_SCHEDULE_FORM_FIELD_IDS.pauseOnFailure}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              checked={value}
              labelPlacement="right"
              overrides={overrides.pauseOnFailureCheckbox}
              onChange={(e) => onChange(e.currentTarget.checked)}
              aria-label="Enable pause on failure"
            >
              Enable pause on failure
            </Checkbox>
          )}
        />
      </DomainSchedulesHorizontalField>
    </div>
  );
}
