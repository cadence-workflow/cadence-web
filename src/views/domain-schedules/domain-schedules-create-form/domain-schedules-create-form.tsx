'use client';

import React from 'react';

import { Checkbox } from 'baseui/checkbox';
import { Input } from 'baseui/input';
import { Radio, RadioGroup } from 'baseui/radio';
import { LabelXSmall } from 'baseui/typography';
import { Controller, useFormState } from 'react-hook-form';

import CronScheduleInput from '@/components/cron-schedule-input/cron-schedule-input';
import MultiJsonInput from '@/components/multi-json-input/multi-json-input';
// TODO(refactor): WORKER_SDK_LANGUAGES is imported from start-workflow — extract to shared constants once both features stabilise
import { WORKER_SDK_LANGUAGES } from '@/route-handlers/start-workflow/start-workflow.constants';
import DomainSchedulesCreateAdvancedForm from '@/views/domain-schedules/domain-schedules-create-advanced-form/domain-schedules-create-advanced-form';
import DomainSchedulesHorizontalField from '@/views/domain-schedules/domain-schedules-horizontal-field/domain-schedules-horizontal-field';
// TODO(refactor): getFieldErrorMessage and getFieldObjectErrorMessages are imported from start-workflow helpers — extract to shared utils
import getFieldErrorMessage from '@/views/workflow-actions/workflow-action-start-form/helpers/get-field-error-message';
import getFieldObjectErrorMessages from '@/views/workflow-actions/workflow-action-start-form/helpers/get-field-object-error-messages';
// FIXME(refactor): Share multi-JSON field error wiring with Start workflow in a common helper (cross-cutting create-schedule / Start workflow imports).
import getMultiJsonErrorMessage from '@/views/workflow-actions/workflow-action-start-form/helpers/get-multi-json-error-message';

import {
  CREATE_SCHEDULE_FORM_FIELD_IDS,
  CREATE_SCHEDULE_MAIN_FIELD_DESCRIPTIONS,
} from './domain-schedules-create-form.constants';
import { overrides } from './domain-schedules-create-form.styles';
import { type Props } from './domain-schedules-create-form.types';

export default function DomainSchedulesCreateForm({
  control,
  trigger,
  clearErrors,
  cluster,
}: Props) {
  const { errors: fieldErrors, isSubmitted } = useFormState({ control });
  const cronExpressionError = getFieldObjectErrorMessages(
    fieldErrors,
    'cronExpression'
  );
  const cronExpressionErrorMessage =
    typeof cronExpressionError === 'string'
      ? cronExpressionError
      : cronExpressionError?.general;

  const inputError = getMultiJsonErrorMessage(fieldErrors, 'input');

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
        label="Worker SDK"
        description={CREATE_SCHEDULE_MAIN_FIELD_DESCRIPTIONS.workerSDK}
      >
        <Controller
          name="workerSDKLanguage"
          control={control}
          defaultValue={WORKER_SDK_LANGUAGES[0]}
          render={({ field: { value, onChange, ref, ...field } }) => (
            <RadioGroup
              {...field}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              aria-label="Worker SDK"
              value={value}
              onChange={(e) => {
                onChange(e.currentTarget.value);
              }}
              error={Boolean(
                getFieldErrorMessage(fieldErrors, 'workerSDKLanguage')
              )}
              align="horizontal"
            >
              {WORKER_SDK_LANGUAGES.map((language) => (
                <Radio key={language} value={language}>
                  {language}
                </Radio>
              ))}
            </RadioGroup>
          )}
        />
      </DomainSchedulesHorizontalField>

      <DomainSchedulesHorizontalField
        label="JSON input arguments (optional)"
        description={CREATE_SCHEDULE_MAIN_FIELD_DESCRIPTIONS.workflowInput}
        error={
          typeof inputError === 'string'
            ? inputError
            : Array.isArray(inputError)
              ? inputError.find(Boolean)
              : undefined
        }
      >
        <Controller
          name="input"
          control={control}
          defaultValue={['']}
          render={({ field }) => (
            <MultiJsonInput
              label="JSON input arguments (optional)"
              placeholder="Enter JSON input"
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                if (isSubmitted) trigger('input');
              }}
              error={inputError}
              addButtonText="Add argument"
              showLeftBorder={false}
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

      <DomainSchedulesCreateAdvancedForm
        control={control}
        fieldErrors={fieldErrors}
        trigger={trigger}
        isSubmitted={isSubmitted}
        clearErrors={clearErrors}
        cluster={cluster}
      />
    </div>
  );
}
