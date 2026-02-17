import React, { useMemo } from 'react';

import { DatePicker } from 'baseui/datepicker';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { RadioGroup, Radio } from 'baseui/radio';
import { Spinner, SIZE as SPINNER_SIZE } from 'baseui/spinner';
import { Controller, useWatch } from 'react-hook-form';
import { MdWarning } from 'react-icons/md';

import CronScheduleInput from '@/components/cron-schedule-input/cron-schedule-input';
import MultiJsonInput from '@/components/multi-json-input/multi-json-input';
import useDebouncedValue from '@/hooks/use-debounced-value/use-debounced-value';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import { WORKER_SDK_LANGUAGES } from '@/route-handlers/start-workflow/start-workflow.constants';

import WorkflowActionStartOptionalSection from '../workflow-action-start-optional-section/workflow-action-start-optional-section';

import getFieldErrorMessage from './helpers/get-field-error-message';
import getFieldObjectErrorMessages from './helpers/get-field-object-error-messages';
import getMultiJsonErrorMessage from './helpers/get-multi-json-error-message';
import getTaskListCaptionMessage from './helpers/get-task-list-caption-message';
import useDescribeTaskList from './hooks/use-describe-task-list';
import { TASK_LIST_DEBOUNCE_MS } from './hooks/use-describe-task-list.constants';
import { overrides, cssStyles } from './workflow-action-start-form.styles';
import { type Props } from './workflow-action-start-form.types';

export default function WorkflowActionStartForm({
  fieldErrors,
  control,
  clearErrors,
  formData,
  trigger,
  cluster,
  domain,
}: Props) {
  const now = useMemo(() => new Date(), []);
  const { cls } = useStyletronClasses(cssStyles);

  const scheduleType = useWatch({
    control,
    name: 'scheduleType',
    defaultValue: 'NOW',
  });

  const taskListName = useWatch({
    control,
    name: 'taskList.name',
    defaultValue: '',
  });

  const { debouncedValue: debouncedTaskListName, isDebouncePending } =
    useDebouncedValue(taskListName, TASK_LIST_DEBOUNCE_MS);

  const {
    data: taskListData,
    isLoading: isTaskListQueryLoading,
    isError: isTaskListError,
  } = useDescribeTaskList({
    domain,
    cluster,
    taskListName: debouncedTaskListName,
  });

  const isTaskListLoading =
    (isDebouncePending && taskListName.length > 0) || isTaskListQueryLoading;

  const taskListCaptionMessage = getTaskListCaptionMessage({
    taskListData,
    isTaskListLoading,
    isTaskListError,
    taskListName,
  });

  return (
    <div>
      <FormControl
        label="Task List"
        caption={
          taskListCaptionMessage ? (
            <span className={cls.warningCaption}>
              <MdWarning />
              {taskListCaptionMessage}
            </span>
          ) : undefined
        }
        overrides={
          taskListCaptionMessage ? overrides.taskListWarningCaption : undefined
        }
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
              onChange={(e) => {
                field.onChange(e.target.value.trim());
              }}
              onBlur={() => {
                field.onBlur();
              }}
              error={Boolean(
                getFieldErrorMessage(fieldErrors, 'taskList.name')
              )}
              size="compact"
              placeholder="Enter task list name"
              endEnhancer={
                isTaskListLoading ? (
                  <Spinner $size={SPINNER_SIZE.small} />
                ) : undefined
              }
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
              error={Boolean(
                getFieldErrorMessage(fieldErrors, 'workflowType.name')
              )}
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
                getFieldErrorMessage(
                  fieldErrors,
                  'executionStartToCloseTimeoutSeconds'
                )
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
            error={getMultiJsonErrorMessage(fieldErrors, 'input')}
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
              error={Boolean(getFieldErrorMessage(fieldErrors, 'scheduleType'))}
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
                error={Boolean(getFieldErrorMessage(fieldErrors, 'firstRunAt'))}
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
            render={({ field }) => (
              <CronScheduleInput
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  trigger('cronSchedule');
                }}
                onBlur={field.onBlur}
                error={getFieldObjectErrorMessages(fieldErrors, 'cronSchedule')}
              />
            )}
          />
        </FormControl>
      )}

      <WorkflowActionStartOptionalSection
        control={control}
        clearErrors={clearErrors}
        formData={formData}
        fieldErrors={fieldErrors}
        cluster={cluster}
      />
    </div>
  );
}
