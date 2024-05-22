import React, { Suspense } from 'react';
import WorkflowPageHeader from './workflow-page-header/workflow-page-header';
import type { Props } from './workflow-page.types';
import AsyncPropsLoader from '@/components/async-props-loader/async-props-loader';
import WorkflowStatusTag from '../shared/workflow-status-tag/workflow-status-tag';
import { getCachedWorkflowExecution } from './helpers/get-workflow-execution';
import decodeUrlParams from '@/utils/decode-url-params';

export default async function WorkflowPage({ params, children }: Props) {
  const decodedParams = decodeUrlParams(params) as Props['params'];

  return (
    <>
      <WorkflowPageHeader
        domain={decodedParams.domain}
        workflowId={decodedParams.workflowId}
        runId={decodedParams.runId}
        cluster={decodedParams.cluster}
        workflowStatusTag={
          <Suspense>
            <AsyncPropsLoader
              component={WorkflowStatusTag}
              getAsyncProps={async () => {
                const res = await getCachedWorkflowExecution(
                  decodedParams.cluster,
                  {
                    domain: decodedParams.domain,
                    workflowExecution: {
                      workflowId: decodedParams.workflowId,
                      runId: decodedParams.runId,
                    },
                  }
                );
                return {
                  status:
                    res.workflowExecutionInfo.closeStatus ||
                    'WORKFLOW_EXECUTION_STATUS_RUNNING',
                };
              }}
            />
          </Suspense>
        }
      />
      {children}
    </>
  );
}
