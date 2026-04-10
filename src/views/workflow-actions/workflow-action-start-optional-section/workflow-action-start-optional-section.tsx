import React, { useMemo } from 'react';

import { StatefulPanel } from 'baseui/accordion';
import { Button } from 'baseui/button';
import { FormControl } from 'baseui/form-control';
import { mergeOverrides } from 'baseui/helpers/overrides';
import { Input } from 'baseui/input';
import { Select } from 'baseui/select';
import { Textarea } from 'baseui/textarea';
import { Controller } from 'react-hook-form';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

import useStyletronClasses from '@/hooks/use-styletron-classes';
import isActiveActiveDomain from '@/views/shared/active-active/helpers/is-active-active-domain';
import useDomainDescription from '@/views/shared/hooks/use-domain-description/use-domain-description';
import useSearchAttributes from '@/views/shared/hooks/use-search-attributes/use-search-attributes';
import WorkflowActionsSearchAttributes from '@/views/workflow-actions/workflow-actions-search-attributes/workflow-actions-search-attributes';

import getFieldErrorMessage from '../workflow-action-start-form/helpers/get-field-error-message';
import getSearchAttributesErrorMessage from '../workflow-action-start-form/helpers/get-search-attributes-error-message';
import WorkflowActionStartRetryPolicy from '../workflow-action-start-retry-policy/workflow-action-start-retry-policy';
import WorkflowActionsClusterAttribute from '../workflow-actions-cluster-attribute/workflow-actions-cluster-attribute';

import { workflowIdReusePolicyOptions } from './workflow-action-start-optional-section.constants';
import {
  cssStyles,
  overrides,
} from './workflow-action-start-optional-section.styles';
import { type Props } from './workflow-action-start-optional-section.types';

export default function WorkflowActionStartOptionalSection({
  control,
  clearErrors,
  formData,
  fieldErrors,
  cluster,
  domain,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);

  const { data: domainData, isLoading: isLoadingDomain } = useDomainDescription(
    { domain, cluster }
  );

  const isActiveActive = domainData && isActiveActiveDomain(domainData);

  // Fetch custom search attributes for the input component
  const { data: searchAttributesData, isLoading: isLoadingSearchAttributes } =
    useSearchAttributes({ cluster, category: 'custom' });

  const searchAttributesOptions = useMemo(() => {
    return Object.entries(searchAttributesData?.keys || {}).map(
      ([name, valueType]) => ({
        name,
        valueType,
      })
    );
  }, [searchAttributesData?.keys]);

  return (
    <StatefulPanel
      overrides={mergeOverrides(overrides.optionalConfigPanel, {
        Header: {
          component: (props) => (
            <div className={cls.expandOptionalSectionHeader}>
              <Button
                size="mini"
                kind="tertiary"
                type="button"
                data-testid={`workflow-action-start-optional-section-${
                  isLoadingDomain || isLoadingSearchAttributes
                    ? 'loading'
                    : 'loaded'
                }`}
                startEnhancer={
                  props.$expanded ? (
                    <MdExpandLess size={20} />
                  ) : (
                    <MdExpandMore size={20} />
                  )
                }
                onClick={() => props.onClick?.({ expanded: !props.$expanded })}
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
                error={Boolean(getFieldErrorMessage(fieldErrors, 'workflowId'))}
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
                  error={Boolean(
                    getFieldErrorMessage(fieldErrors, 'workflowIdReusePolicy')
                  )}
                  size="compact"
                  placeholder="Select reuse policy"
                  clearable={false}
                />
              );
            }}
          />
        </FormControl>

        <WorkflowActionStartRetryPolicy
          control={control}
          clearErrors={clearErrors}
          formData={formData}
          fieldErrors={fieldErrors}
        />

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
                error={Boolean(getFieldErrorMessage(fieldErrors, 'header'))}
                size="compact"
                placeholder='{"key":"value"}'
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
                error={Boolean(getFieldErrorMessage(fieldErrors, 'memo'))}
                size="compact"
                placeholder='{"key":"value"}'
                rows={3}
              />
            )}
          />
        </FormControl>

        <FormControl label="Search Attributes (optional)">
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
                error={getSearchAttributesErrorMessage(
                  fieldErrors,
                  'searchAttributes'
                )}
              />
            )}
          />
        </FormControl>

        {isActiveActive && (
          <FormControl label="Cluster Attribute (optional)">
            <Controller
              name="clusterAttribute"
              control={control}
              render={({ field }) => (
                <WorkflowActionsClusterAttribute
                  clusterAttributesByScope={
                    domainData.activeClusters.activeClustersByClusterAttribute
                  }
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormControl>
        )}
      </>
    </StatefulPanel>
  );
}
