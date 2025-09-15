import React, { useMemo } from 'react';

import { StatefulPanel } from 'baseui/accordion';
import { Button } from 'baseui/button';
import { Checkbox } from 'baseui/checkbox';
import { DatePicker } from 'baseui/datepicker';
import { FormControl } from 'baseui/form-control';
import { mergeOverrides } from 'baseui/helpers/overrides';
import { Input } from 'baseui/input';
import { RadioGroup, Radio } from 'baseui/radio';
import { Select } from 'baseui/select';
import { Textarea } from 'baseui/textarea';
import { get } from 'lodash';
import { Controller, useWatch } from 'react-hook-form';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

import MultiJsonInput from '@/components/multi-json-input/multi-json-input';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import { WORKER_SDK_LANGUAGES } from '@/route-handlers/start-workflow/start-workflow.constants';

import { workflowIdReusePolicyOptions } from './workflow-action-start-form.constants';
import { cssStyles, overrides } from './workflow-action-start-form.styles';
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

  const { cls } = useStyletronClasses(cssStyles);

  const scheduleType = useWatch({
    control,
    name: 'scheduleType',
    defaultValue: 'NOW',
  });

  const enableRetryPolicy = useWatch({
    control,
    name: 'enableRetryPolicy',
    defaultValue: false,
  });

  const limitRetries = useWatch({
    control,
    name: 'limitRetries',
    defaultValue: 'ATTEMPTS',
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

      {/* Optional Configurations Section */}
      <StatefulPanel
        overrides={mergeOverrides(overrides.optionalConfigPanel, {
          Header: {
            component: (props) => (
              <div className={cls.expandOptionalSectionHeader}>
                <Button
                  size="mini"
                  kind="tertiary"
                  type="button"
                  startEnhancer={
                    props.$expanded ? (
                      <MdExpandLess size={20} />
                    ) : (
                      <MdExpandMore size={20} />
                    )
                  }
                  onClick={() =>
                    props.onClick?.({ expanded: !props.$expanded })
                  }
                >
                  {`${props.$expanded ? 'Hide' : 'Show'} Optional Configurations`}
                </Button>
                <div className={cls.expandOptionalSectionDivider} />
              </div>
            ),
          },
        })}
      >
        <>
          <FormControl label="Workflow ID (optional)">
            <Controller
              name="workflowId"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...field } }) => (
                <Input
                  {...field}
                  // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                  inputRef={ref}
                  aria-label="Workflow ID"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  onBlur={field.onBlur}
                  error={Boolean(getErrorMessage('workflowId'))}
                  size="compact"
                  placeholder="Enter workflow ID"
                />
              )}
            />
          </FormControl>

          <FormControl label="Workflow ID Reuse Policy">
            <Controller
              name="workflowIdReusePolicy"
              control={control}
              defaultValue="WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE_FAILED_ONLY"
              render={({ field: { value, onChange, ref, ...field } }) => {
                return (
                  <Select
                    {...field}
                    inputRef={ref}
                    aria-label="Workflow ID Reuse Policy"
                    options={workflowIdReusePolicyOptions}
                    value={value ? [{ id: value }] : []}
                    onChange={(params) => {
                      onChange(params.value[0]?.id || undefined);
                    }}
                    error={Boolean(getErrorMessage('workflowIdReusePolicy'))}
                    size="compact"
                    placeholder="Select reuse policy"
                    clearable={false}
                  />
                );
              }}
            />
          </FormControl>

          <FormControl>
            <Controller
              name="enableRetryPolicy"
              control={control}
              defaultValue={false}
              render={({ field: { value, onChange, ref, ...field } }) => (
                <Checkbox
                  {...field}
                  // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                  inputRef={ref}
                  aria-label="Enable Retry Policy"
                  checked={value}
                  checkmarkType="toggle"
                  labelPlacement="right"
                  overrides={overrides.toggle}
                  onChange={(e) => {
                    clearErrors('retryPolicy.initialIntervalSeconds');
                    clearErrors('retryPolicy.backoffCoefficient');
                    clearErrors('retryPolicy.maximumIntervalSeconds');
                    clearErrors('retryPolicy.maximumAttempts');
                    clearErrors('retryPolicy.expirationIntervalSeconds');
                    onChange(e.currentTarget.checked);
                  }}
                  error={Boolean(getErrorMessage('enableRetryPolicy'))}
                >
                  Enable retry policy
                </Checkbox>
              )}
            />
          </FormControl>

          {enableRetryPolicy && (
            <div className={cls.retryPolicySection}>
              <FormControl label="Initial Interval">
                <Controller
                  name="retryPolicy.initialIntervalSeconds"
                  control={control}
                  defaultValue=""
                  render={({ field: { ref, ...field } }) => (
                    <Input
                      {...field}
                      // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                      inputRef={ref}
                      aria-label="Initial Interval"
                      type="number"
                      onBlur={field.onBlur}
                      error={Boolean(
                        getErrorMessage('retryPolicy.initialIntervalSeconds')
                      )}
                      size="compact"
                      placeholder="Enter initial interval in seconds"
                    />
                  )}
                />
              </FormControl>

              <FormControl label="Backoff Coefficient">
                <Controller
                  name="retryPolicy.backoffCoefficient"
                  control={control}
                  defaultValue=""
                  render={({ field: { ref, ...field } }) => (
                    <Input
                      {...field}
                      // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                      inputRef={ref}
                      aria-label="Backoff Coefficient"
                      type="number"
                      step={0.1}
                      min={1}
                      onBlur={field.onBlur}
                      error={Boolean(
                        getErrorMessage('retryPolicy.backoffCoefficient')
                      )}
                      size="compact"
                      placeholder="Enter backoff coefficient"
                    />
                  )}
                />
              </FormControl>

              <FormControl label="Maximum Interval (optional)">
                <Controller
                  name="retryPolicy.maximumIntervalSeconds"
                  control={control}
                  defaultValue=""
                  render={({ field: { ref, ...field } }) => (
                    <Input
                      {...field}
                      // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                      inputRef={ref}
                      aria-label="Maximum Interval"
                      type="number"
                      min={1}
                      onBlur={field.onBlur}
                      error={Boolean(
                        getErrorMessage('retryPolicy.maximumIntervalSeconds')
                      )}
                      size="compact"
                      placeholder="Enter maximum interval in seconds"
                    />
                  )}
                />
              </FormControl>

              <FormControl label="Limit Retries">
                <Controller
                  name="limitRetries"
                  control={control}
                  defaultValue="ATTEMPTS"
                  render={({ field: { value, onChange, ref, ...field } }) => (
                    <RadioGroup
                      {...field}
                      // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                      inputRef={ref}
                      aria-label="Retries Limit"
                      value={value}
                      onChange={(e) => {
                        clearErrors('retryPolicy.maximumAttempts');
                        clearErrors('retryPolicy.expirationIntervalSeconds');
                        onChange(e.currentTarget.value);
                      }}
                      error={Boolean(getErrorMessage('retriesLimit'))}
                      align="horizontal"
                    >
                      <Radio value="ATTEMPTS">Attempts</Radio>
                      <Radio value="DURATION">Duration</Radio>
                    </RadioGroup>
                  )}
                />
              </FormControl>

              {limitRetries === 'DURATION' && (
                <FormControl label="Expiration Interval">
                  <Controller
                    name="retryPolicy.expirationIntervalSeconds"
                    control={control}
                    defaultValue=""
                    render={({ field: { ref, ...field } }) => (
                      <Input
                        {...field}
                        // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                        inputRef={ref}
                        aria-label="Expiration Interval"
                        type="number"
                        min={1}
                        onBlur={field.onBlur}
                        error={Boolean(
                          getErrorMessage(
                            'retryPolicy.expirationIntervalSeconds'
                          )
                        )}
                        size="compact"
                        placeholder="Enter expiration interval in seconds"
                      />
                    )}
                  />
                </FormControl>
              )}

              {limitRetries === 'ATTEMPTS' && (
                <FormControl label="Maximum Attempts">
                  <Controller
                    name="retryPolicy.maximumAttempts"
                    control={control}
                    defaultValue=""
                    render={({ field: { ref, ...field } }) => (
                      <Input
                        {...field}
                        // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                        inputRef={ref}
                        aria-label="Maximum Attempts"
                        type="number"
                        min={1}
                        onBlur={field.onBlur}
                        error={Boolean(
                          getErrorMessage('retryPolicy.maximumAttempts')
                        )}
                        size="compact"
                        placeholder="Enter maximum attempts"
                      />
                    )}
                  />
                </FormControl>
              )}
            </div>
          )}

          <FormControl label="Header (optional)">
            <Controller
              name="header"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...field } }) => (
                <Textarea
                  {...field}
                  // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                  inputRef={ref}
                  aria-label="Header"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  overrides={overrides.jsonInput}
                  onBlur={field.onBlur}
                  error={Boolean(getErrorMessage('header'))}
                  size="compact"
                  placeholder='{"key": "value"}'
                  rows={3}
                />
              )}
            />
          </FormControl>

          <FormControl label="Memo (optional)">
            <Controller
              name="memo"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...field } }) => (
                <Textarea
                  {...field}
                  // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                  inputRef={ref}
                  aria-label="Memo"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  overrides={overrides.jsonInput}
                  onBlur={field.onBlur}
                  error={Boolean(getErrorMessage('memo'))}
                  size="compact"
                  placeholder='{"key": "value"}'
                  rows={3}
                />
              )}
            />
          </FormControl>

          <FormControl label="Search Attributes (optional)">
            <Controller
              name="searchAttributes"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...field } }) => (
                <Textarea
                  {...field}
                  // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                  inputRef={ref}
                  aria-label="Search Attributes"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  overrides={overrides.jsonInput}
                  onBlur={field.onBlur}
                  error={Boolean(getErrorMessage('searchAttributes'))}
                  size="compact"
                  placeholder='{"key": "value"}'
                  rows={3}
                />
              )}
            />
          </FormControl>
        </>
      </StatefulPanel>
    </div>
  );
}
