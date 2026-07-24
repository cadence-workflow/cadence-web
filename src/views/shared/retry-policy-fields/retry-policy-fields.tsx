'use client';

import { Checkbox } from 'baseui/checkbox';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Radio, RadioGroup } from 'baseui/radio';
import { LabelXSmall } from 'baseui/typography';
import { Controller, useWatch } from 'react-hook-form';

import useStyletronClasses from '@/hooks/use-styletron-classes';
import getFieldErrorMessage from '@/views/workflow-actions/workflow-action-start-form/helpers/get-field-error-message';

import RetryPolicyFieldsWrapper from './retry-policy-fields-wrapper/retry-policy-fields-wrapper';
import { cssStyles, overrides } from './retry-policy-fields.styles';
import { type InnerProps, type Props } from './retry-policy-fields.types';
import { type RetryPolicyFormFields } from './schemas/retry-policy-form-schema';

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
      fieldComponent={props.fieldComponent}
    />
  );
}

function RetryPolicyFieldsInner({
  control,
  clearErrors,
  fieldErrors,
  variant,
  idPrefix = 'retry-policy-form',
  fieldComponent,
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
      <RetryPolicyFieldsWrapper
        fieldComponent={fieldComponent}
        label="Retry policy"
        description="Controls retry behavior for the workflow."
      >
        {enableRetryPolicyCheckbox}
      </RetryPolicyFieldsWrapper>
    ) : (
      <FormControl>{enableRetryPolicyCheckbox}</FormControl>
    );

  const retryPolicyFields = enableRetryPolicy ? (
    <>
      <RetryPolicyFieldsWrapper
        fieldComponent={fieldComponent}
        subfield={variant === 'horizontal'}
        label="Initial Interval"
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
          defaultValue=""
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              id={`${idPrefix}-initial-interval`}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              aria-label="Initial Interval"
              type="number"
              min={1}
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
      </RetryPolicyFieldsWrapper>

      <RetryPolicyFieldsWrapper
        fieldComponent={fieldComponent}
        subfield={variant === 'horizontal'}
        label="Backoff Coefficient"
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
          defaultValue=""
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              id={`${idPrefix}-backoff-coefficient`}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              aria-label="Backoff Coefficient"
              type="number"
              step={0.1}
              min={1}
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
      </RetryPolicyFieldsWrapper>

      <RetryPolicyFieldsWrapper
        fieldComponent={fieldComponent}
        subfield={variant === 'horizontal'}
        label="Maximum Interval (optional)"
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
          defaultValue=""
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              id={`${idPrefix}-maximum-interval`}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              aria-label="Maximum Interval"
              type="number"
              min={1}
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
      </RetryPolicyFieldsWrapper>

      <RetryPolicyFieldsWrapper
        fieldComponent={fieldComponent}
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
      </RetryPolicyFieldsWrapper>

      {limitRetries === 'ATTEMPTS' && (
        <RetryPolicyFieldsWrapper
          fieldComponent={fieldComponent}
          subfield={variant === 'horizontal'}
          label="Maximum Attempts"
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
            defaultValue=""
            render={({ field: { ref, ...field } }) => (
              <Input
                {...field}
                id={`${idPrefix}-maximum-attempts`}
                // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                inputRef={ref}
                aria-label="Maximum Attempts"
                type="number"
                min={1}
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
        </RetryPolicyFieldsWrapper>
      )}

      {limitRetries === 'DURATION' && (
        <RetryPolicyFieldsWrapper
          fieldComponent={fieldComponent}
          subfield={variant === 'horizontal'}
          label="Expiration Interval"
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
            defaultValue=""
            render={({ field: { ref, ...field } }) => (
              <Input
                {...field}
                id={`${idPrefix}-expiration-interval`}
                // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                inputRef={ref}
                aria-label="Expiration Interval"
                type="number"
                min={1}
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
        </RetryPolicyFieldsWrapper>
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
