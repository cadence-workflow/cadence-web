import { notFound, redirect } from 'next/navigation';
import queryString from 'query-string';

import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';
import request from '@/utils/request';
import { RequestError } from '@/utils/request/request-error';

import { type Props } from './redirect-workflow.types';

export default async function RedirectWorkflow(props: Props) {
  const [domain, cluster, workflowId, ...restParams] =
    props.params.workflowParams;

  if (!domain || !cluster || !workflowId) {
    throw new Error('Invalid workflow URL param');
  }

  let runId: string | null | undefined;

  try {
    const describeWorkflowResponse: DescribeWorkflowResponse = await request(
      `/api/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows/${encodeURIComponent(workflowId)}`
    ).then((res) => res.json());

    runId =
      describeWorkflowResponse.workflowExecutionInfo?.workflowExecution?.runId;
  } catch (e) {
    if (e instanceof RequestError && e.status === 404) {
      notFound();
    }
    throw e;
  }

  if (!runId) {
    notFound();
  }

  const baseUrl = `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows/${encodeURIComponent(workflowId)}/${encodeURIComponent(runId)}`;

  redirect(
    queryString.stringifyUrl({
      url: baseUrl + (restParams.length > 0 ? `/${restParams.join('/')}` : ''),
      query: props.searchParams,
    })
  );
}
