'use client';

import React from 'react';

import { Checkbox } from 'baseui/checkbox';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { RadioGroup, Radio } from 'baseui/radio';
import { Select } from 'baseui/select';
import { LabelXSmall } from 'baseui/typography';
import { Controller } from 'react-hook-form';

import CronScheduleInput from '@/components/cron-schedule-input/cron-schedule-input';
import MultiJsonInput from '@/components/multi-json-input/multi-json-input';
import {
  SCHEDULE_CATCH_UP_POLICIES,
  SCHEDULE_OVERLAP_POLICIES,
} from '@/route-handlers/create-schedule/create-schedule.constants';
import { WORKER_SDK_LANGUAGES } from '@/route-handlers/start-workflow/start-workflow.constants';
import getFieldErrorMessage from '@/views/workflow-actions/workflow-action-start-form/helpers/get-field-error-message';
import getFieldObjectErrorMessages from '@/views/workflow-actions/workflow-action-start-form/helpers/get-field-object-error-messages';
import getMultiJsonErrorMessage from '@/views/workflow-actions/workflow-action-start-form/helpers/get-multi-json-error-message';

import {
  CATCH_UP_WINDOW_DEFAULT_DAYS,
  CATCH_UP_WINDOW_MAX_DAYS,
  CATCH_UP_WINDOW_MIN_DAYS,
} from '../create-schedule-modal.constants';
import { styled } from './create-schedule-form.styles';
import { type Props } from './create-schedule-form.types';

export default function CreateScheduleForm({
  control,
  fieldErrors,
  catchUpPolicy,
}: Props) {
  return (
    <div>
      <styled.SectionLabel>Schedule</styled.SectionLabel>

      <FormControl label="Cron Expression (UTC)">
        <Controller
          name="cronExpression"
          control={control}
          render={({ field }) => (
            <CronScheduleInput
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={getFieldObjectErrorMessages(fieldErrors, 'cronExpression')}
            />
          )}
        />
      </FormControl>

      <styled.SectionLabel>Workflow Action</styled.SectionLabel>

      <FormControl
        label="Workflow Type"
        error={getFieldErrorMessage(fieldErrors, 'workflowType.name')}
      >
        <Controller
          name="workflowType.name"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
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
      </FormControl>

      <FormControl
        label="Task List"
        error={getFieldErrorMessage(fieldErrors, 'taskList.name')}
      >
        <Controller
          name="taskList.name"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              aria-label="Task List"
              onChange={(e) => field.onChange(e.target.value.trim())}
              onBlur={field.onBlur}
              error={Boolean(getFieldErrorMessage(fieldErrors, 'taskList.name'))}
              size="compact"
              placeholder="Enter task list name"
            />
          )}
        />
      </FormControl>

      <FormControl
        label="Task Start-to-Close Timeout"
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
      </FormControl>

      <FormControl
        label="Execution Start-to-Close Timeout"
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
      </FormControl>

      <FormControl label="Workflow ID Prefix (optional)">
        <Controller
          name="workflowIdPrefix"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              aria-label="Workflow ID Prefix"
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              size="compact"
              placeholder="Enter workflow ID prefix (optional)"
            />
          )}
        />
      </FormControl>

      <FormControl label="Worker SDK">
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
              onChange={(e) => onChange(e.currentTarget.value)}
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
      </FormControl>

      <Controller
        name="input"
        control={control}
        defaultValue={['']}
        render={({ field }) => (
          <MultiJsonInput
            label="JSON Input Arguments (optional)"
            placeholder="Enter JSON input"
            value={field.value}
            onChange={field.onChange}
            error={getMultiJsonErrorMessage(fieldErrors, 'input')}
            addButtonText="Add argument"
          />
        )}
      />

      <styled.SectionLabel>Policies</styled.SectionLabel>

      <FormControl label="Overlap Policy">
        <Controller
          name="overlapPolicy"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Select
              {...field}
              aria-label="Overlap Policy"
              value={[{ id: value }]}
              onChange={({ value: selected }) => {
                if (selected[0]) onChange(selected[0].id);
              }}
              options={SCHEDULE_OVERLAP_POLICIES.map((policy) => ({
                id: policy,
                label: policy,
              }))}
              size="compact"
              clearable={false}
            />
          )}
        />
      </FormControl>

      <FormControl label="Catch-Up Policy">
        <Controller
          name="catchUpPolicy"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Select
              {...field}
              aria-label="Catch-Up Policy"
              value={[{ id: value }]}
              onChange={({ value: selected }) => {
                if (selected[0]) onChange(selected[0].id);
              }}
              options={SCHEDULE_CATCH_UP_POLICIES.map((policy) => ({
                id: policy,
                label: policy,
              }))}
              size="compact"
              clearable={false}
            />
          )}
        />
      </FormControl>

      {catchUpPolicy !== 'SCHEDULE_CATCH_UP_POLICY_SKIP' && (
        <FormControl
          label="Catch-Up Window (Days)"
          error={getFieldErrorMessage(fieldErrors, 'catchUpWindowDays')}
        >
          <Controller
            name="catchUpWindowDays"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                inputRef={ref}
                aria-label="Catch-Up Window"
                type="number"
                min={CATCH_UP_WINDOW_MIN_DAYS}
                max={CATCH_UP_WINDOW_MAX_DAYS}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? parseInt(e.target.value, 10) : undefined
                  )
                }
                onBlur={field.onBlur}
                error={Boolean(
                  getFieldErrorMessage(fieldErrors, 'catchUpWindowDays')
                )}
                size="compact"
                placeholder={`Enter days (max ${CATCH_UP_WINDOW_MAX_DAYS})`}
                endEnhancer={<LabelXSmall>Days</LabelXSmall>}
              />
            )}
          />
        </FormControl>
      )}

      <FormControl
        label="Buffer Limit"
        error={getFieldErrorMessage(fieldErrors, 'bufferLimit')}
      >
        <Controller
          name="bufferLimit"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              value={field.value ?? ''}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              aria-label="Buffer Limit"
              type="number"
              min={0}
              onChange={(e) =>
                field.onChange(
                  e.target.value !== ''
                    ? parseInt(e.target.value, 10)
                    : undefined
                )
              }
              onBlur={field.onBlur}
              error={Boolean(getFieldErrorMessage(fieldErrors, 'bufferLimit'))}
              size="compact"
              placeholder="Enter buffer limit (0 = no buffering)"
            />
          )}
        />
      </FormControl>

      <Controller
        name="pauseOnFailure"
        control={control}
        defaultValue={false}
        render={({ field: { value, onChange, ref, ...field } }) => (
          <Checkbox
            {...field}
            // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
            inputRef={ref}
            checked={value}
            onChange={(e) => onChange(e.currentTarget.checked)}
          >
            Pause on failure
          </Checkbox>
        )}
      />
    </div>
  );
}
