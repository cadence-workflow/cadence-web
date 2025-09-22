import React from 'react';

import { Checkbox } from 'baseui/checkbox';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { RadioGroup, Radio } from 'baseui/radio';
import { Controller, useWatch } from 'react-hook-form';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import {
  overrides,
  cssStyles,
} from './workflow-action-start-retry-policy.styles';
import { type Props } from './workflow-action-start-retry-policy.types';

export default function WorkflowActionStartRetryPolicy({
  control,
  clearErrors,
  formData: _formData,
  getErrorMessage,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);
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
    <>
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
                  error={Boolean(getErrorMessage('limitRetries'))}
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
                      getErrorMessage('retryPolicy.expirationIntervalSeconds')
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
    </>
  );
}
