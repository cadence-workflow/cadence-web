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
import { type Props } from './retry-policy-fields.types';
import { type RetryPolicyFormFields } from './schemas/retry-policy-form-schema';

export default function RetryPolicyFields<
  TFieldValues extends RetryPolicyFormFields,
>(props: Props<TFieldValues>) {
  const control = props.control as Props<RetryPolicyFormFields>['control'];
  const clearErrors =
    props.clearErrors as Props<RetryPolicyFormFields>['clearErrors'];
  const fieldErrors =
    props.fieldErrors as Props<RetryPolicyFormFields>['fieldErrors'];
  const { idPrefix = 'retry-policy-form', fieldComponent } = props;
  const { cls } = useStyletronClasses(cssStyles);
  const usesCustomFieldComponent = Boolean(fieldComponent);
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

  const enableRetryPolicyField = usesCustomFieldComponent ? (
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
        subfield
        label="Initial Interval"
        description="How long to wait before first retry."
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
        subfield
        label="Backoff Coefficient"
        description="Multiplier applied between retries."
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
        subfield
        label="Maximum Interval (optional)"
        description="Upper bound for retry interval."
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
        subfield
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
      </RetryPolicyFieldsWrapper>

      {limitRetries === 'ATTEMPTS' && (
        <RetryPolicyFieldsWrapper
          fieldComponent={fieldComponent}
          subfield
          label="Maximum Attempts"
          description="Total number of retry attempts."
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
          subfield
          label="Expiration Interval"
          description="Maximum total retry duration."
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
      {!usesCustomFieldComponent && retryPolicyFields ? (
        <div className={cls.retryPolicySection}>{retryPolicyFields}</div>
      ) : (
        retryPolicyFields
      )}
    </>
  );
}
