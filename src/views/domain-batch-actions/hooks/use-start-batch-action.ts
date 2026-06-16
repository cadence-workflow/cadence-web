'use client';

import { useMutation } from '@tanstack/react-query';

import {
  BATCH_ACTION_BATCHER_DOMAIN,
  BATCH_ACTION_DOMAIN_SEARCH_ATTRIBUTE,
  BATCH_ACTION_WORKFLOW_TYPE,
} from '@/route-handlers/list-batch-actions/list-batch-actions.constants';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import {
  BATCH_ACTION_EXECUTION_TIMEOUT_SECONDS,
  BATCH_ACTION_TASK_LIST,
} from '../domain-batch-actions.constants';
import buildBatchActionPayload from '../helpers/build-batch-action-payload';

import {
  type BuildBatchActionPayloadParams,
  type StartBatchActionResponse,
  type UseStartBatchActionParams,
} from './use-start-batch-action.types';

export default function useStartBatchAction({
  cluster,
}: UseStartBatchActionParams) {
  return useMutation<
    StartBatchActionResponse,
    RequestError,
    BuildBatchActionPayloadParams
  >({
    mutationFn: (input) => {
      const batchParams = buildBatchActionPayload(input);
      return request(
        `/api/domains/${encodeURIComponent(BATCH_ACTION_BATCHER_DOMAIN)}/${encodeURIComponent(cluster)}/workflows/start`,
        {
          method: 'POST',
          body: JSON.stringify({
            workflowType: { name: BATCH_ACTION_WORKFLOW_TYPE },
            taskList: { name: BATCH_ACTION_TASK_LIST },
            // The batcher workflow signature is `(ctx, params BatchParams)` — a
            // single struct. We pass it as a one-element top-level array so
            // processWorkflowInput's GO branch (input.map(JSON.stringify).join(' '))
            // emits exactly '{...batchParams}'.
            input: [batchParams],
            workerSDKLanguage: 'GO',
            executionStartToCloseTimeoutSeconds:
              BATCH_ACTION_EXECUTION_TIMEOUT_SECONDS,
            // Tag the batcher workflow with the target domain so batch actions
            // can be searched/filtered by the domain they operate on. Uses the
            // same search attribute the list query filters on.
            searchAttributes: {
              [BATCH_ACTION_DOMAIN_SEARCH_ATTRIBUTE]: input.domain,
            },
          }),
        }
      ).then((res): Promise<StartBatchActionResponse> => res.json());
    },
  });
}
