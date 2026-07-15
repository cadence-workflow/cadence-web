'use client';

import React from 'react';

import { Checkbox } from 'baseui/checkbox';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Radio, RadioGroup } from 'baseui/radio';
import { LabelXSmall } from 'baseui/typography';
import { Controller, useWatch } from 'react-hook-form';

import useStyletronClasses from '@/hooks/use-styletron-classes';
import DomainSchedulesHorizontalField from '@/views/domain-schedules/domain-schedules-horizontal-field/domain-schedules-horizontal-field';
import getFieldErrorMessage from '@/views/workflow-actions/workflow-action-start-form/helpers/get-field-error-message';

import { cssStyles, overrides } from './retry-policy-fields.styles';
import {
  type InnerProps,
  type Props,
} from './retry-policy-fields.types';
import { type RetryPolicyFormFields } from './retry-policy-form.schema';

type FieldWrapperProps = {
  label: string;
  description?: string;
  htmlFor?: string;
  error?: string;
  subfield?: boolean;
  children: React.ReactNode;
};

export default function RetryPolicyFields<
  TFieldValues extends RetryPolicyFormFields,
>(props: Props<TFieldValues>) {
  return (
    <RetryPolicyFieldsInner
      control={props.control as InnerProps['control']}
      clearErrors={props.clearErrors as InnerProps['clearErrors']}
      fieldErrors={props.fieldErrors as InnerProps['fieldErrors']}
      variant={props.variant}
      idPrefix={props.idPrefix}
    />
  );
}

function RetryPolicyFieldsInner({
  control,
  clearErrors,
  fieldErrors,
  variant,
  idPrefix = 'retry-policy-form',
}: InnerProps) {
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

  const FieldWrapper =
    variant === 'horizontal' ? HorizontalFieldWrapper : CompactFieldWrapper;

  const enableRetryPolicyCheckbox = (
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
  );

  const enableRetryPolicyField =
    variant === 'horizontal' ? (
      <HorizontalFieldWrapper
        label="Retry policy"
        description="Controls retry behavior for the started workflow."
      >
        {enableRetryPolicyCheckbox}
      </HorizontalFieldWrapper>
    ) : (
      <FormControl>{enableRetryPolicyCheckbox}</FormControl>
    );

  const retryPolicyFields = enableRetryPolicy ? (
    <>
      <FieldWrapper
        subfield={variant === 'horizontal'}
        label="Initial interval"
        description={
          variant === 'horizontal'
            ? 'How long to wait before first retry.'
            : undefined
        }
        htmlFor={`${idPrefix}-initial-interval`}
        error={getFieldErrorMessage(
          fieldErrors,
          'retryPolicy.initialIntervalSeconds'
        )}
      >
        <Controller
          name="retryPolicy.initialIntervalSeconds"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              id={`${idPrefix}-initial-interval`}
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
      </FieldWrapper>

      <FieldWrapper
        subfield={variant === 'horizontal'}
        label="Backoff coefficient"
        description={
          variant === 'horizontal'
            ? 'Multiplier applied between retries.'
            : undefined
        }
        htmlFor={`${idPrefix}-backoff-coefficient`}
        error={getFieldErrorMessage(
          fieldErrors,
          'retryPolicy.backoffCoefficient'
        )}
      >
        <Controller
          name="retryPolicy.backoffCoefficient"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              id={`${idPrefix}-backoff-coefficient`}
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
      </FieldWrapper>

      <FieldWrapper
        subfield={variant === 'horizontal'}
        label="Maximum interval (optional)"
        description={
          variant === 'horizontal'
            ? 'Upper bound for retry interval.'
            : undefined
        }
        htmlFor={`${idPrefix}-maximum-interval`}
        error={getFieldErrorMessage(
          fieldErrors,
          'retryPolicy.maximumIntervalSeconds'
        )}
      >
        <Controller
          name="retryPolicy.maximumIntervalSeconds"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              id={`${idPrefix}-maximum-interval`}
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
      </FieldWrapper>

      <FieldWrapper
        subfield={variant === 'horizontal'}
        label="Limit retries"
        description={
          variant === 'horizontal'
            ? 'Choose whether retries are limited by attempts or duration.'
            : undefined
        }
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
      </FieldWrapper>

      {limitRetries === 'ATTEMPTS' && (
        <FieldWrapper
          subfield={variant === 'horizontal'}
          label="Maximum attempts"
          description={
            variant === 'horizontal'
              ? 'Total number of retry attempts.'
              : undefined
          }
          htmlFor={`${idPrefix}-maximum-attempts`}
          error={getFieldErrorMessage(
            fieldErrors,
            'retryPolicy.maximumAttempts'
          )}
        >
          <Controller
            name="retryPolicy.maximumAttempts"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <Input
                {...field}
                id={`${idPrefix}-maximum-attempts`}
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
                  getFieldErrorMessage(
                    fieldErrors,
                    'retryPolicy.maximumAttempts'
                  )
                )}
                size="compact"
                placeholder="Enter maximum attempts"
              />
            )}
          />
        </FieldWrapper>
      )}

      {limitRetries === 'DURATION' && (
        <FieldWrapper
          subfield={variant === 'horizontal'}
          label="Expiration interval"
          description={
            variant === 'horizontal'
              ? 'Maximum total retry duration.'
              : undefined
          }
          htmlFor={`${idPrefix}-expiration-interval`}
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
                id={`${idPrefix}-expiration-interval`}
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
        </FieldWrapper>
      )}
    </>
  ) : null;

  return (
    <>
      {enableRetryPolicyField}
      {variant === 'compact' && retryPolicyFields ? (
        <div className={cls.retryPolicySection}>{retryPolicyFields}</div>
      ) : (
        retryPolicyFields
      )}
    </>
  );
}

function HorizontalFieldWrapper({
  label,
  description,
  htmlFor,
  error,
  subfield = false,
  children,
}: FieldWrapperProps) {
  return (
    <DomainSchedulesHorizontalField
      label={label}
      description={description}
      htmlFor={htmlFor}
      error={error}
      subfield={subfield}
    >
      {children}
    </DomainSchedulesHorizontalField>
  );
}

function CompactFieldWrapper({
  label,
  error,
  children,
}: FieldWrapperProps) {
  return <FormControl label={label} error={error}>{children}</FormControl>;
}
