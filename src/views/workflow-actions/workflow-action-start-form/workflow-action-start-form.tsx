import React, { useMemo } from 'react';

import { DatePicker } from 'baseui/datepicker';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { RadioGroup, Radio } from 'baseui/radio';
import { get } from 'lodash';
import { Controller, useWatch } from 'react-hook-form';

import MultiJsonInput from '@/components/multi-json-input/multi-json-input';
import { WORKER_SDK_LANGUAGES } from '@/route-handlers/start-workflow/start-workflow.constants';

import WorkflowActionStartOptionalSection from '../workflow-action-start-optional-section/workflow-action-start-optional-section';

import { type Props } from './workflow-action-start-form.types';

export default function WorkflowActionStartForm({
  fieldErrors,
  control,
  clearErrors,
  formData: _formData,
}: Props) {
  const now = useMemo(() => new Date(), []);

  const getErrorMessage = (field: string) => {
    const error = get(fieldErrors, field);
    if (Array.isArray(error)) {
      return error.map((err) => err?.message);
    }
    return error?.message;
  };

  const scheduleType = useWatch({
    control,
    name: 'scheduleType',
    defaultValue: 'NOW',
  });

  return (
    <div>
      <FormControl label="Task List">
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
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              onBlur={field.onBlur}
              error={Boolean(getErrorMessage('taskList.name'))}
              size="compact"
              placeholder="Enter task list name"
            />
          )}
        />
      </FormControl>

      <FormControl label="Workflow Type">
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
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              onBlur={field.onBlur}
              error={Boolean(getErrorMessage('workflowType.name'))}
              size="compact"
              placeholder="Enter workflow type name"
            />
          )}
        />
      </FormControl>

      <FormControl label="Execution Start to Close Timeout">
        <Controller
          name="executionStartToCloseTimeoutSeconds"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              aria-label="Execution Start to Close Timeout"
              type="number"
              min={1}
              onChange={(e) => {
                field.onChange(
                  e.target.value ? parseInt(e.target.value, 10) : undefined
                );
              }}
              onBlur={field.onBlur}
              error={Boolean(
                getErrorMessage('executionStartToCloseTimeoutSeconds')
              )}
              placeholder="Enter timeout in seconds"
              size="compact"
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
              onChange={(e) => {
                onChange(e.currentTarget.value);
              }}
              error={Boolean(getErrorMessage('workerSDKLanguage'))}
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
            label="JSON input arguments (optional)"
            placeholder="Enter JSON input"
            value={field.value}
            onChange={field.onChange}
            error={getErrorMessage('input')}
            addButtonText="Add argument"
          />
        )}
      />

      <FormControl label="Schedule Time">
        <Controller
          name="scheduleType"
          control={control}
          defaultValue="NOW"
          render={({ field: { value, onChange, ref, ...field } }) => (
            <RadioGroup
              {...field}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              aria-label="Schedule Time"
              value={value}
              onChange={(e) => {
                clearErrors('firstRunAt');
                clearErrors('cronSchedule');
                onChange(e.currentTarget.value);
              }}
              error={Boolean(getErrorMessage('scheduleType'))}
              align="horizontal"
            >
              <Radio value="NOW">Now</Radio>
              <Radio value="LATER">Later</Radio>
              <Radio value="CRON">Cron</Radio>
            </RadioGroup>
          )}
        />
      </FormControl>

      {scheduleType === 'LATER' && (
        <FormControl label="Run At">
          <Controller
            name="firstRunAt"
            control={control}
            defaultValue=""
            render={({ field: { value, onChange, ref, ...field } }) => (
              <DatePicker
                {...field}
                // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                inputRef={ref}
                aria-label="Run At"
                value={value ? [new Date(value)] : []}
                onChange={({ date }) => {
                  const d = Array.isArray(date) ? date[0] : date;
                  if (d) {
                    onChange(d.toISOString());
                  } else {
                    onChange(undefined);
                  }
                }}
                error={Boolean(getErrorMessage('firstRunAt'))}
                size="compact"
                timeSelectStart
                formatString="yyyy/MM/dd HH:mm"
                minDate={now}
              />
            )}
          />
        </FormControl>
      )}

      {scheduleType === 'CRON' && (
        <FormControl label="Cron Schedule (UTC)">
          <Controller
            name="cronSchedule"
            control={control}
            defaultValue=""
            render={({ field: { ref, ...field } }) => (
              <Input
                {...field}
                // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                inputRef={ref}
                aria-label="Cron Schedule (UTC)"
                size="compact"
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                onBlur={field.onBlur}
                error={Boolean(getErrorMessage('cronSchedule'))}
                placeholder="* * * * *"
              />
            )}
          />
        </FormControl>
      )}

      <WorkflowActionStartOptionalSection
        control={control}
        clearErrors={clearErrors}
        formData={_formData}
        getErrorMessage={getErrorMessage}
      />
    </div>
  );
}
