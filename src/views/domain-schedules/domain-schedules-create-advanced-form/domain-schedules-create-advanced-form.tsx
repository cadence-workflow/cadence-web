'use client';

import React from 'react';

import { StatefulPanel } from 'baseui/accordion';
import { Button } from 'baseui/button';
import { DatePicker } from 'baseui/datepicker';
import { FormControl } from 'baseui/form-control';
import { mergeOverrides } from 'baseui/helpers/overrides';
import { Input } from 'baseui/input';
import { Radio, RadioGroup } from 'baseui/radio';
import { Select } from 'baseui/select';
import { Textarea } from 'baseui/textarea';
import { LabelXSmall } from 'baseui/typography';
import { Controller, useWatch } from 'react-hook-form';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { useMemo } from 'react';

import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import CreateScheduleRetryPolicyFields from '@/views/domain-schedules/create-schedule-retry-policy-fields/create-schedule-retry-policy-fields';
import useSearchAttributes from '@/views/shared/hooks/use-search-attributes/use-search-attributes';
import DomainSchedulesHorizontalField from '@/views/domain-schedules/domain-schedules-horizontal-field/domain-schedules-horizontal-field';
// TODO(refactor): getSearchAttributesErrorMessage is imported from start-workflow helpers — extract to shared utils
import getFieldErrorMessage from '@/views/workflow-actions/workflow-action-start-form/helpers/get-field-error-message';
import getSearchAttributesErrorMessage from '@/views/workflow-actions/workflow-action-start-form/helpers/get-search-attributes-error-message';
// TODO(refactor): WorkflowActionsSearchAttributes is imported from start-workflow feature — extract shared component under views/shared
import WorkflowActionsSearchAttributes from '@/views/workflow-actions/workflow-actions-search-attributes/workflow-actions-search-attributes';

import {
  CATCH_UP_POLICY_OPTIONS,
  CREATE_SCHEDULE_ADVANCED_FIELD_DESCRIPTIONS,
  CREATE_SCHEDULE_ADVANCED_FIELD_IDS,
  DEFAULT_CATCH_UP_POLICY,
  DEFAULT_OVERLAP_POLICY,
  MAX_CATCH_UP_WINDOW_DAYS,
  OVERLAP_POLICY_OPTIONS,
} from './domain-schedules-create-advanced-form.constants';
import {
  overrides,
  styled,
} from './domain-schedules-create-advanced-form.styles';
import { type Props } from './domain-schedules-create-advanced-form.types';

export default function DomainSchedulesCreateAdvancedForm({
  control,
  fieldErrors,
  trigger,
  isSubmitted = false,
  clearErrors,
  cluster,
}: Props) {
  const { data: searchAttributesData, isLoading: isLoadingSearchAttributes } =
    useSearchAttributes({ cluster, category: 'custom' });
  const searchAttributesError = getSearchAttributesErrorMessage(
    fieldErrors,
    'searchAttributes'
  );

  const searchAttributesOptions = useMemo(() => {
    return Object.entries(searchAttributesData?.keys || {}).map(
      ([name, valueType]) => ({
        name,
        valueType,
      })
    );
  }, [searchAttributesData?.keys]);
  const overlapPolicy = useWatch({
    control,
    name: 'overlapPolicy',
    defaultValue: DEFAULT_OVERLAP_POLICY,
  });
  const catchUpPolicy = useWatch({
    control,
    name: 'catchUpPolicy',
    defaultValue: DEFAULT_CATCH_UP_POLICY,
  });
  const startTimeErrorMessage = getFieldErrorMessage(fieldErrors, 'startTime');
  const endTimeErrorMessage = getFieldErrorMessage(fieldErrors, 'endTime');

  const revalidateSchedulePeriod = () => {
    if (isSubmitted) {
      void trigger?.(['startTime', 'endTime']);
    }
  };

  return (
    <StatefulPanel
      overrides={mergeOverrides(overrides.panel, {
        Header: {
          component: (props) => (
            <styled.ToggleRow>
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
                onClick={() => props.onClick?.({ expanded: !props.$expanded })}
              >
                {props.$expanded
                  ? 'Hide advanced configurations'
                  : 'Show advanced configurations'}
              </Button>
              <styled.Divider />
            </styled.ToggleRow>
          ),
        },
      })}
    >
      <>
        <DomainSchedulesHorizontalField
          label="Schedule Id"
          description={CREATE_SCHEDULE_ADVANCED_FIELD_DESCRIPTIONS.scheduleId}
          htmlFor={CREATE_SCHEDULE_ADVANCED_FIELD_IDS.scheduleId}
          error={getFieldErrorMessage(fieldErrors, 'scheduleId')}
        >
          <Controller
            name="scheduleId"
            control={control}
            defaultValue=""
            render={({ field: { ref, ...field } }) => (
              <Input
                {...field}
                id={CREATE_SCHEDULE_ADVANCED_FIELD_IDS.scheduleId}
                // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                inputRef={ref}
                aria-label="Schedule Id"
                onChange={(e) => field.onChange(e.target.value || undefined)}
                onBlur={field.onBlur}
                error={Boolean(getFieldErrorMessage(fieldErrors, 'scheduleId'))}
                size="compact"
                placeholder="Add schedule id"
              />
            )}
          />
        </DomainSchedulesHorizontalField>

        <DomainSchedulesHorizontalField
          label="Overlap Policy"
          description={
            CREATE_SCHEDULE_ADVANCED_FIELD_DESCRIPTIONS.overlapPolicy
          }
          error={getFieldErrorMessage(fieldErrors, 'overlapPolicy')}
        >
          <Controller
            name="overlapPolicy"
            control={control}
            defaultValue={DEFAULT_OVERLAP_POLICY}
            render={({ field: { value, onChange, ref, ...field } }) => (
              <Select
                {...field}
                inputRef={ref}
                aria-label="Overlap Policy"
                options={OVERLAP_POLICY_OPTIONS}
                value={value ? [{ id: value }] : []}
                onChange={(params) => {
                  onChange(params.value[0]?.id);
                }}
                error={Boolean(
                  getFieldErrorMessage(fieldErrors, 'overlapPolicy')
                )}
                size="compact"
                clearable={false}
              />
            )}
          />
        </DomainSchedulesHorizontalField>

        {overlapPolicy ===
          ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER && (
          <DomainSchedulesHorizontalField
            subfield={true}
            label="Buffer limit"
            description={
              CREATE_SCHEDULE_ADVANCED_FIELD_DESCRIPTIONS.bufferLimit
            }
            htmlFor={CREATE_SCHEDULE_ADVANCED_FIELD_IDS.bufferLimit}
            caption="Defaults to 0 (unlimited)"
            error={getFieldErrorMessage(fieldErrors, 'bufferLimit')}
          >
            <Controller
              name="bufferLimit"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Input
                  {...field}
                  id={CREATE_SCHEDULE_ADVANCED_FIELD_IDS.bufferLimit}
                  // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                  inputRef={ref}
                  aria-label="Buffer limit"
                  type="number"
                  min={0}
                  onBlur={field.onBlur}
                  error={Boolean(
                    getFieldErrorMessage(fieldErrors, 'bufferLimit')
                  )}
                  size="compact"
                  placeholder="Set buffer limit"
                />
              )}
            />
          </DomainSchedulesHorizontalField>
        )}

        {overlapPolicy ===
          ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CONCURRENT && (
          <DomainSchedulesHorizontalField
            subfield={true}
            label="Concurrency limit"
            description={
              CREATE_SCHEDULE_ADVANCED_FIELD_DESCRIPTIONS.concurrencyLimit
            }
            htmlFor={CREATE_SCHEDULE_ADVANCED_FIELD_IDS.concurrencyLimit}
            caption="Defaults to 0 (unlimited)"
            error={getFieldErrorMessage(fieldErrors, 'concurrencyLimit')}
          >
            <Controller
              name="concurrencyLimit"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Input
                  {...field}
                  id={CREATE_SCHEDULE_ADVANCED_FIELD_IDS.concurrencyLimit}
                  // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                  inputRef={ref}
                  aria-label="Concurrency limit"
                  type="number"
                  min={0}
                  onBlur={field.onBlur}
                  error={Boolean(
                    getFieldErrorMessage(fieldErrors, 'concurrencyLimit')
                  )}
                  size="compact"
                  placeholder="Set concurrency limit"
                />
              )}
            />
          </DomainSchedulesHorizontalField>
        )}

        <DomainSchedulesHorizontalField
          label="Catch-up Policy"
          description="Controls whether missed schedules should run after downtime."
          error={getFieldErrorMessage(fieldErrors, 'catchUpPolicy')}
        >
          <Controller
            name="catchUpPolicy"
            control={control}
            defaultValue={DEFAULT_CATCH_UP_POLICY}
            render={({ field: { value, onChange, ref, ...field } }) => (
              <RadioGroup
                {...field}
                // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                inputRef={ref}
                aria-label="Catch-up Policy"
                value={value}
                onChange={(e) => onChange(e.currentTarget.value)}
                error={Boolean(
                  getFieldErrorMessage(fieldErrors, 'catchUpPolicy')
                )}
                align="horizontal"
              >
                {CATCH_UP_POLICY_OPTIONS.map((option) => (
                  <Radio key={option.id} value={option.id}>
                    {option.label}
                  </Radio>
                ))}
              </RadioGroup>
            )}
          />
        </DomainSchedulesHorizontalField>

        {catchUpPolicy !==
          ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_SKIP && (
          <DomainSchedulesHorizontalField
            subfield={true}
            label="Catch-up window"
            description="Maximum age of missed schedules that can still be started."
            htmlFor="create-schedule-form-catch-up-window-days"
            error={getFieldErrorMessage(fieldErrors, 'catchUpWindowDays')}
          >
            <Controller
              name="catchUpWindowDays"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Input
                  {...field}
                  id="create-schedule-form-catch-up-window-days"
                  // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                  inputRef={ref}
                  aria-label="Catch-up window"
                  type="number"
                  min={1}
                  max={MAX_CATCH_UP_WINDOW_DAYS}
                  onBlur={field.onBlur}
                  error={Boolean(
                    getFieldErrorMessage(fieldErrors, 'catchUpWindowDays')
                  )}
                  size="compact"
                  placeholder="Set catch-up window"
                  endEnhancer={<LabelXSmall>Days</LabelXSmall>}
                />
              )}
            />
          </DomainSchedulesHorizontalField>
        )}

        <DomainSchedulesHorizontalField
          label="Schedule period"
          description="Optional time range that limits when this schedule can run."
        >
          <styled.SchedulePeriodRow>
            <styled.SchedulePeriodField>
              <styled.SchedulePeriodInputLabel htmlFor="create-schedule-form-start-time">
                Start date
              </styled.SchedulePeriodInputLabel>
              <FormControl
                error={startTimeErrorMessage}
                overrides={overrides.schedulePeriodFormControl}
              >
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field: { value, onChange, ref, ...field } }) => (
                    <DatePicker
                      {...field}
                      // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                      inputRef={ref}
                      id="create-schedule-form-start-time"
                      aria-label="Schedule period start"
                      value={value ? [new Date(value)] : []}
                      onChange={({ date }) => {
                        const d = Array.isArray(date) ? date[0] : date;
                        if (d) {
                          onChange(d.toISOString());
                        } else {
                          onChange(undefined);
                        }
                        revalidateSchedulePeriod();
                      }}
                      error={Boolean(startTimeErrorMessage)}
                      size="compact"
                      timeSelectStart
                      formatString="yyyy/MM/dd HH:mm"
                      clearable
                    />
                  )}
                />
              </FormControl>
            </styled.SchedulePeriodField>
            <styled.SchedulePeriodField>
              <styled.SchedulePeriodInputLabel htmlFor="create-schedule-form-end-time">
                End date
              </styled.SchedulePeriodInputLabel>
              <FormControl
                error={endTimeErrorMessage}
                overrides={overrides.schedulePeriodFormControl}
              >
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field: { value, onChange, ref, ...field } }) => (
                    <DatePicker
                      {...field}
                      // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                      inputRef={ref}
                      id="create-schedule-form-end-time"
                      aria-label="Schedule period end"
                      value={value ? [new Date(value)] : []}
                      onChange={({ date }) => {
                        const d = Array.isArray(date) ? date[0] : date;
                        if (d) {
                          onChange(d.toISOString());
                        } else {
                          onChange(undefined);
                        }
                        revalidateSchedulePeriod();
                      }}
                      error={Boolean(endTimeErrorMessage)}
                      size="compact"
                      timeSelectStart
                      formatString="yyyy/MM/dd HH:mm"
                      clearable
                    />
                  )}
                />
              </FormControl>
            </styled.SchedulePeriodField>
          </styled.SchedulePeriodRow>
        </DomainSchedulesHorizontalField>

        <DomainSchedulesHorizontalField
          label="Memo (optional)"
          description="JSON object that is attached to each started workflow."
          htmlFor="create-schedule-form-memo"
          error={getFieldErrorMessage(fieldErrors, 'memo')}
        >
          <Controller
            name="memo"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <Textarea
                {...field}
                value={field.value ?? ''}
                id="create-schedule-form-memo"
                // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                inputRef={ref}
                aria-label="Memo"
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                error={Boolean(getFieldErrorMessage(fieldErrors, 'memo'))}
                size="compact"
                placeholder='{"key":"value"}'
                rows={3}
              />
            )}
          />
        </DomainSchedulesHorizontalField>

        <DomainSchedulesHorizontalField
          label="Search attributes (optional)"
          description="Additional indexed attributes attached to each started workflow."
          error={
            typeof searchAttributesError === 'string'
              ? searchAttributesError
              : undefined
          }
        >
          <Controller
            name="searchAttributes"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <WorkflowActionsSearchAttributes
                value={field.value}
                onChange={field.onChange}
                searchAttributes={searchAttributesOptions}
                isLoading={isLoadingSearchAttributes}
                error={searchAttributesError}
                showSectionBorder={false}
              />
            )}
          />
        </DomainSchedulesHorizontalField>

        <CreateScheduleRetryPolicyFields
          control={control}
          clearErrors={clearErrors}
          fieldErrors={fieldErrors}
        />

        <DomainSchedulesHorizontalField
          label="Jitter duration"
          description={
            CREATE_SCHEDULE_ADVANCED_FIELD_DESCRIPTIONS.jitterSeconds
          }
          htmlFor={CREATE_SCHEDULE_ADVANCED_FIELD_IDS.jitterSeconds}
          error={getFieldErrorMessage(fieldErrors, 'jitterSeconds')}
        >
          <Controller
            name="jitterSeconds"
            control={control}
            defaultValue=""
            render={({ field: { ref, ...field } }) => (
              <Input
                {...field}
                id={CREATE_SCHEDULE_ADVANCED_FIELD_IDS.jitterSeconds}
                // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                inputRef={ref}
                aria-label="Jitter duration"
                type="number"
                min={0}
                onBlur={field.onBlur}
                error={Boolean(
                  getFieldErrorMessage(fieldErrors, 'jitterSeconds')
                )}
                size="compact"
                placeholder="Add Jitter duration"
                endEnhancer={<LabelXSmall>Seconds</LabelXSmall>}
              />
            )}
          />
        </DomainSchedulesHorizontalField>

        <DomainSchedulesHorizontalField
          label="Workflow Id Prefix"
          description={
            CREATE_SCHEDULE_ADVANCED_FIELD_DESCRIPTIONS.workflowIdPrefix
          }
          htmlFor={CREATE_SCHEDULE_ADVANCED_FIELD_IDS.workflowIdPrefix}
          error={getFieldErrorMessage(fieldErrors, 'workflowIdPrefix')}
        >
          <Controller
            name="workflowIdPrefix"
            control={control}
            defaultValue=""
            render={({ field: { ref, ...field } }) => (
              <Input
                {...field}
                id={CREATE_SCHEDULE_ADVANCED_FIELD_IDS.workflowIdPrefix}
                // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                inputRef={ref}
                aria-label="Workflow Id Prefix"
                onChange={(e) => field.onChange(e.target.value || undefined)}
                onBlur={field.onBlur}
                error={Boolean(
                  getFieldErrorMessage(fieldErrors, 'workflowIdPrefix')
                )}
                size="compact"
                placeholder="Add workflow id prefix"
              />
            )}
          />
        </DomainSchedulesHorizontalField>
      </>
    </StatefulPanel>
  );
}
