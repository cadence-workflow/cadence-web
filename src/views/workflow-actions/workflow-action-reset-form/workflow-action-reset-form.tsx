import { useMemo } from 'react';

import {
  Checkbox,
  STYLE_TYPE as CHECKBOX_STYLE_TYPE,
  LABEL_PLACEMENT as CHECKBOX_LABEL_PLACEMENT,
} from 'baseui/checkbox';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Radio, RadioGroup, ALIGN } from 'baseui/radio';
import { Select } from 'baseui/select';
import { Textarea } from 'baseui/textarea';
import { Controller, useWatch } from 'react-hook-form';

import { useDescribeWorkflow } from '@/views/workflow-page/hooks/use-describe-workflow';

import { type Props } from './workflow-action-reset-form.types';

export default function WorkflowActionResetForm({
  fieldErrors,
  control,
  workflowId,
  runId,
  domain,
  cluster,
  clearErrors,
}: Props) {
  const defaultResetTo = 'EventId';
  const resetType = useWatch({
    control,
    name: 'resetType',
    defaultValue: defaultResetTo,
  });

  const {
    data: workflow,
    isLoading,
    isError,
    refetch,
  } = useDescribeWorkflow({
    cluster,
    workflowId,
    runId,
    domain,
  });

  const binaryChecksumOptions = useMemo(() => {
    const points =
      workflow?.workflowExecutionInfo?.autoResetPoints?.points || [];
    return points
      .filter((point) => point.resettable)
      .map((point) => ({
        id: point.firstDecisionCompletedId,
        label: point.binaryChecksum,
      }));
  }, [workflow]);

  const getErrorMessage = (field: string) => {
    return field in fieldErrors
      ? fieldErrors[field as keyof typeof fieldErrors]?.message
      : undefined;
  };

  return (
    <div>
      <FormControl label="Reset Type">
        <Controller
          name="resetType"
          control={control}
          defaultValue={defaultResetTo}
          render={({ field: { value, onChange, ref, ...field } }) => (
            <RadioGroup
              {...field}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              value={value}
              onChange={(e) => {
                clearErrors('decisionFinishEventId');
                clearErrors('binaryChecksumFirstDecisionCompletedId');
                onChange(e.currentTarget.value);
              }}
              error={Boolean(fieldErrors.resetType?.message)}
              align={ALIGN.horizontal}
            >
              <Radio value="EventId">Event ID</Radio>
              <Radio value="BinaryChecksum">Binary Checksum</Radio>
            </RadioGroup>
          )}
        />
      </FormControl>

      {resetType === 'EventId' && (
        <FormControl label="Event ID">
          <Controller
            name="decisionFinishEventId"
            control={control}
            defaultValue=""
            render={({ field: { ref, ...field } }) => (
              <Input
                {...field}
                // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                inputRef={ref}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                onBlur={field.onBlur}
                error={Boolean(getErrorMessage('decisionFinishEventId'))}
                type="number"
                placeholder="Find Event ID"
              />
            )}
          />
        </FormControl>
      )}

      {resetType === 'BinaryChecksum' && (
        <FormControl label="Binary Checksum">
          <Controller
            name="binaryChecksumFirstDecisionCompletedId"
            control={control}
            defaultValue=""
            render={({ field: { value, onChange, ref, ...field } }) => (
              <Select
                {...field}
                inputRef={ref}
                aria-label="Select binary checksum"
                options={binaryChecksumOptions}
                value={value ? [{ id: value, label: value }] : []}
                onChange={({ value }) => {
                  onChange(value[0]?.id || '');
                }}
                onOpen={() => {
                  if (isError) refetch();
                }}
                isLoading={isLoading}
                error={Boolean(
                  getErrorMessage('binaryChecksumFirstDecisionCompletedId')
                )}
                placeholder="Select binary checksum"
                noResultsMsg={
                  isError
                    ? 'Failed to load binary checksums'
                    : 'No results found'
                }
              />
            )}
          />
        </FormControl>
      )}

      <FormControl>
        <Controller
          name="skipSignalReapply"
          control={control}
          defaultValue={false}
          render={({ field: { value, onChange, ref, ...field } }) => (
            <Checkbox
              {...field}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              checkmarkType={CHECKBOX_STYLE_TYPE.toggle_round}
              labelPlacement={CHECKBOX_LABEL_PLACEMENT.right}
              checked={value}
              error={Boolean(fieldErrors.skipSignalReapply?.message)}
              onChange={(e) => onChange(e.currentTarget.checked)}
            >
              Skip signal re-apply
            </Checkbox>
          )}
        />
      </FormControl>

      <FormControl label="Reason">
        <Controller
          name="reason"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...field } }) => (
            <Textarea
              {...field}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              onBlur={field.onBlur}
              error={Boolean(fieldErrors.reason?.message)}
              placeholder="Enter reason for reset"
            />
          )}
        />
      </FormControl>
    </div>
  );
}
