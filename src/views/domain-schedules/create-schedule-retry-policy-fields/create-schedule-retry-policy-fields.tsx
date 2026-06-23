'use client';

import React from 'react';

import { Checkbox } from 'baseui/checkbox';
import { Input } from 'baseui/input';
import { Radio, RadioGroup } from 'baseui/radio';
import { LabelXSmall } from 'baseui/typography';
import { Controller, useWatch } from 'react-hook-form';

import DomainSchedulesHorizontalField from '@/views/domain-schedules/domain-schedules-horizontal-field/domain-schedules-horizontal-field';
import getFieldErrorMessage from '@/views/workflow-actions/workflow-action-start-form/helpers/get-field-error-message';

import { overrides } from './create-schedule-retry-policy-fields.styles';
import { type Props } from './create-schedule-retry-policy-fields.types';

export default function CreateScheduleRetryPolicyFields({
  control,
  clearErrors,
  fieldErrors,
}: Props) {
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
      <DomainSchedulesHorizontalField
        label="Retry policy"
        description="Controls retry behavior for the started workflow."
      >
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
              error={Boolean(
                getFieldErrorMessage(fieldErrors, 'enableRetryPolicy')
              )}
            >
              Enable retry policy
            </Checkbox>
          )}
        />
      </DomainSchedulesHorizontalField>

      {enableRetryPolicy && (
        <DomainSchedulesHorizontalField.GroupedFields>
          <DomainSchedulesHorizontalField
            label="Initial interval"
            description="How long to wait before first retry."
            htmlFor="create-schedule-form-retry-initial-interval"
            error={getFieldErrorMessage(fieldErrors, 'retryPolicy.initialIntervalSeconds')}
          >
            <Controller
              name="retryPolicy.initialIntervalSeconds"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Input
                  {...field}
                  id="create-schedule-form-retry-initial-interval"
                  value={field.value ?? ''}
                  // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                  inputRef={ref}
                  aria-label="Initial interval"
                  type="number"
                  min={1}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ''
                        ? undefined
                        : parseInt(e.target.value, 10)
                    )
                  }
                  onBlur={field.onBlur}
                  error={Boolean(
                    getFieldErrorMessage(
                      fieldErrors,
                      'retryPolicy.initialIntervalSeconds'
                    )
                  )}
                  size="compact"
                  placeholder="Enter initial interval"
                  endEnhancer={<LabelXSmall>Seconds</LabelXSmall>}
                />
              )}
            />
          </DomainSchedulesHorizontalField>

          <DomainSchedulesHorizontalField
            label="Backoff coefficient"
            description="Multiplier applied between retries."
            htmlFor="create-schedule-form-retry-backoff-coefficient"
            error={getFieldErrorMessage(fieldErrors, 'retryPolicy.backoffCoefficient')}
          >
            <Controller
              name="retryPolicy.backoffCoefficient"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Input
                  {...field}
                  id="create-schedule-form-retry-backoff-coefficient"
                  value={field.value ?? ''}
                  // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                  inputRef={ref}
                  aria-label="Backoff coefficient"
                  type="number"
                  step={0.1}
                  min={1}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ''
                        ? undefined
                        : parseFloat(e.target.value)
                    )
                  }
                  onBlur={field.onBlur}
                  error={Boolean(
                    getFieldErrorMessage(
                      fieldErrors,
                      'retryPolicy.backoffCoefficient'
                    )
                  )}
                  size="compact"
                  placeholder="Enter backoff coefficient"
                />
              )}
            />
          </DomainSchedulesHorizontalField>

          <DomainSchedulesHorizontalField
            label="Maximum interval (optional)"
            description="Upper bound for retry interval."
            htmlFor="create-schedule-form-retry-maximum-interval"
            error={getFieldErrorMessage(fieldErrors, 'retryPolicy.maximumIntervalSeconds')}
          >
            <Controller
              name="retryPolicy.maximumIntervalSeconds"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Input
                  {...field}
                  id="create-schedule-form-retry-maximum-interval"
                  value={field.value ?? ''}
                  // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                  inputRef={ref}
                  aria-label="Maximum interval"
                  type="number"
                  min={1}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ''
                        ? undefined
                        : parseInt(e.target.value, 10)
                    )
                  }
                  onBlur={field.onBlur}
                  error={Boolean(
                    getFieldErrorMessage(
                      fieldErrors,
                      'retryPolicy.maximumIntervalSeconds'
                    )
                  )}
                  size="compact"
                  placeholder="Enter maximum interval"
                  endEnhancer={<LabelXSmall>Seconds</LabelXSmall>}
                />
              )}
            />
          </DomainSchedulesHorizontalField>

          <DomainSchedulesHorizontalField
            label="Limit retries"
            description="Choose whether retries are limited by attempts or duration."
            error={getFieldErrorMessage(fieldErrors, 'limitRetries')}
          >
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
                  error={Boolean(getFieldErrorMessage(fieldErrors, 'limitRetries'))}
                  align="horizontal"
                >
                  <Radio value="ATTEMPTS">Attempts</Radio>
                  <Radio value="DURATION">Duration</Radio>
                </RadioGroup>
              )}
            />
          </DomainSchedulesHorizontalField>

          {limitRetries === 'ATTEMPTS' && (
            <DomainSchedulesHorizontalField
              label="Maximum attempts"
              description="Total number of retry attempts."
              htmlFor="create-schedule-form-retry-maximum-attempts"
              error={getFieldErrorMessage(fieldErrors, 'retryPolicy.maximumAttempts')}
            >
              <Controller
                name="retryPolicy.maximumAttempts"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <Input
                    {...field}
                    id="create-schedule-form-retry-maximum-attempts"
                    value={field.value ?? ''}
                    // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                    inputRef={ref}
                    aria-label="Maximum attempts"
                    type="number"
                    min={1}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ''
                          ? undefined
                          : parseInt(e.target.value, 10)
                      )
                    }
                    onBlur={field.onBlur}
                    error={Boolean(
                      getFieldErrorMessage(fieldErrors, 'retryPolicy.maximumAttempts')
                    )}
                    size="compact"
                    placeholder="Enter maximum attempts"
                  />
                )}
              />
            </DomainSchedulesHorizontalField>
          )}

          {limitRetries === 'DURATION' && (
            <DomainSchedulesHorizontalField
              label="Expiration interval"
              description="Maximum total retry duration."
              htmlFor="create-schedule-form-retry-expiration-interval"
              error={getFieldErrorMessage(
                fieldErrors,
                'retryPolicy.expirationIntervalSeconds'
              )}
            >
              <Controller
                name="retryPolicy.expirationIntervalSeconds"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <Input
                    {...field}
                    id="create-schedule-form-retry-expiration-interval"
                    value={field.value ?? ''}
                    // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                    inputRef={ref}
                    aria-label="Expiration interval"
                    type="number"
                    min={1}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ''
                          ? undefined
                          : parseInt(e.target.value, 10)
                      )
                    }
                    onBlur={field.onBlur}
                    error={Boolean(
                      getFieldErrorMessage(
                        fieldErrors,
                        'retryPolicy.expirationIntervalSeconds'
                      )
                    )}
                    size="compact"
                    placeholder="Enter expiration interval"
                    endEnhancer={<LabelXSmall>Seconds</LabelXSmall>}
                  />
                )}
              />
            </DomainSchedulesHorizontalField>
          )}
        </DomainSchedulesHorizontalField.GroupedFields>
      )}
    </>
  );
}
