'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Button } from 'baseui/button';
import { Skeleton } from 'baseui/skeleton';
import { Spinner } from 'baseui/spinner';
import { LabelSmall } from 'baseui/typography';
import { MdRefresh } from 'react-icons/md';

import ErrorPanel from '@/components/error-panel/error-panel';
import PageSection from '@/components/page-section/page-section';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';
import formatDate from '@/utils/data-formatters/format-date';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';
import { type WorkflowPageTabContentProps } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import { cssStyles, overrides } from './workflow-stack-trace.styles';

export default function WorkflowStackTrace(props: WorkflowPageTabContentProps) {
  const { domain, cluster, workflowId, runId } = props.params;

  const { data, refetch, isFetching, dataUpdatedAt, isError, isSuccess } =
    useSuspenseQuery<
      QueryWorkflowResponse,
      RequestError,
      QueryWorkflowResponse,
      [
        string,
        Pick<
          WorkflowPageTabContentProps['params'],
          'cluster' | 'domain' | 'runId' | 'workflowId'
        >,
      ]
    >({
      queryKey: [
        'workflow_stack_trace',
        { domain, cluster, workflowId, runId },
      ] as const,
      queryFn: () => {
        return request(
          `/api/domains/${domain}/${cluster}/workflows/${workflowId}/${runId}/query/__stack_trace`,
          {
            method: 'POST',
          }
        ).then((res) => res.json());
      },
    });

  const { cls } = useStyletronClasses(cssStyles);
  return (
    <PageSection className={cls.pageContainer}>
      <div className={cls.pageHeader}>
        {Boolean(dataUpdatedAt) && (
          <LabelSmall suppressHydrationWarning>
            Last updated {formatDate(dataUpdatedAt)}
          </LabelSmall>
        )}
        <Button
          shape="pill"
          size="mini"
          kind="secondary"
          startEnhancer={<MdRefresh size={12} />}
          endEnhancer={isFetching && <Spinner $size={12} />}
          disabled={isFetching}
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </div>
      {isFetching && (
        <Skeleton overrides={overrides.loadingSkeleton} animation />
      )}
      {!isFetching && isError && (
        <ErrorPanel message="Failed to load stack trace" />
      )}
      {!isFetching && isSuccess && (
        <div className={cls.stackTrace}>
          <pre>{String(data.result) || 'No stack trace...'}</pre>
        </div>
      )}
    </PageSection>
  );
}
