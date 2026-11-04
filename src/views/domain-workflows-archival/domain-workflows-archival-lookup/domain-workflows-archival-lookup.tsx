'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'baseui/button';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import ErrorPanel from '@/components/error-panel/error-panel';

import domainWorkflowsArchivalLookupConfig from '../config/domain-workflows-archival-lookup.config';

import { styled } from './domain-workflows-archival-lookup.styles';
import {
  type Props,
  type ArchivalLookupFormValues,
} from './domain-workflows-archival-lookup.types';
import domainWorkflowsArchivalLookupFormSchema from './schemas/domain-workflows-archival-lookup-form-schema';

export default function DomainWorkflowsArchivalLookup({
  domain,
  cluster,
}: Props) {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ArchivalLookupFormValues>({
    resolver: zodResolver(domainWorkflowsArchivalLookupFormSchema),
    defaultValues: { workflowId: '', runId: '' },
  });

  const onSubmit = ({ workflowId, runId }: ArchivalLookupFormValues) => {
    router.push(
      `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows/${encodeURIComponent(workflowId)}/${encodeURIComponent(runId)}`
    );
  };

  return (
    <ErrorPanel
      message={domainWorkflowsArchivalLookupConfig.title}
      description={domainWorkflowsArchivalLookupConfig.description}
      actions={[
        {
          kind: 'custom',
          key: 'domain-workflows-archival-lookup-form',
          content: (
            <styled.Form onSubmit={handleSubmit(onSubmit)} noValidate>
              <styled.FieldsContainer>
                <FormControl
                  label={domainWorkflowsArchivalLookupConfig.workflowIdLabel}
                  error={errors.workflowId?.message}
                >
                  <Controller
                    name="workflowId"
                    control={control}
                    render={({ field: { ref, ...field } }) => (
                      <Input
                        {...field}
                        // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                        inputRef={ref}
                        size="compact"
                        error={Boolean(errors.workflowId)}
                        placeholder={
                          domainWorkflowsArchivalLookupConfig.workflowIdPlaceholder
                        }
                      />
                    )}
                  />
                </FormControl>
                <FormControl
                  label={domainWorkflowsArchivalLookupConfig.runIdLabel}
                  error={errors.runId?.message}
                >
                  <Controller
                    name="runId"
                    control={control}
                    render={({ field: { ref, ...field } }) => (
                      <Input
                        {...field}
                        // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                        inputRef={ref}
                        size="compact"
                        error={Boolean(errors.runId)}
                        placeholder={
                          domainWorkflowsArchivalLookupConfig.runIdPlaceholder
                        }
                      />
                    )}
                  />
                </FormControl>
              </styled.FieldsContainer>
              <Button type="submit" size="compact">
                {domainWorkflowsArchivalLookupConfig.submitButtonLabel}
              </Button>
            </styled.Form>
          ),
        },
      ]}
    />
  );
}
