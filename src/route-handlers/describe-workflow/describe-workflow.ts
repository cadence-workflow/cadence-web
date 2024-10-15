import merge from 'lodash/merge';
import { NextResponse, type NextRequest } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import * as grpcClient from '@/utils/grpc/grpc-client';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import {
  type DescribeUnArchivedWorkflowResponse,
  type DescribeArchivedWorkflowResponse,
  type RequestParams,
} from './describe-workflow.types';

export default async function describeWorkflow(
  _: NextRequest,
  requestParams: RequestParams
) {
  const decodedParams = decodeUrlParams(requestParams.params);

  try {
    const describeWorkflowResponse = await grpcClient.clusterMethods[
      decodedParams.cluster
    ].describeWorkflow({
      domain: decodedParams.domain,
      workflowExecution: {
        workflowId: decodedParams.workflowId,
        runId: decodedParams.runId,
      },
    });

    const res: DescribeUnArchivedWorkflowResponse = merge(
      {},
      describeWorkflowResponse,
      {
        workflowExecutionInfo: { closeEvent: null, isArchived: false as const },
      }
    );
    if (
      res.workflowExecutionInfo &&
      res.workflowExecutionInfo.closeStatus &&
      res.workflowExecutionInfo.closeStatus !==
        'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID'
    ) {
      const closeEventResponse = await grpcClient.clusterMethods[
        decodedParams.cluster
      ].getHistory({
        domain: decodedParams.domain,
        workflowExecution: {
          workflowId: decodedParams.workflowId,
          runId: decodedParams.runId,
        },
        historyEventFilterType: 'EVENT_FILTER_TYPE_CLOSE_EVENT',
      });
      if (closeEventResponse.history?.events?.[0])
        res.workflowExecutionInfo.closeEvent =
          closeEventResponse.history?.events?.[0];
    }

    return NextResponse.json(res);
  } catch (e) {
    // DescribeWorkflow depends on a temp datasource, so sometimes data is not available
    // to make it more reliable we depend on history to construct similar response in case data is not available
    try {
      if (e instanceof GRPCError && e.httpStatusCode !== 404) {
        throw e;
      }
      const archivedHistoryResponse = await grpcClient.clusterMethods[
        decodedParams.cluster
      ].getHistory({
        domain: decodedParams.domain,
        workflowExecution: {
          workflowId: decodedParams.workflowId,
          runId: decodedParams.runId,
        },
        pageSize: 1,
      });
      const archivedHistoryEvents =
        archivedHistoryResponse.history?.events || [];

      if (!archivedHistoryEvents[0]?.workflowExecutionStartedEventAttributes) {
        throw e;
      }

      const {
        eventTime: startTime,
        workflowExecutionStartedEventAttributes: {
          taskList,
          executionStartToCloseTimeout,
          taskStartToCloseTimeout,
          workflowType: type,
        },
      } = archivedHistoryEvents[0];

      const res: DescribeArchivedWorkflowResponse = {
        executionConfiguration: {
          taskList,
          executionStartToCloseTimeout,
          taskStartToCloseTimeout,
        },
        workflowExecutionInfo: {
          workflowExecution: {
            runId: decodedParams.runId,
            workflowId: decodedParams.workflowId,
          },
          isArchived: true,
          startTime,
          type,
          closeTime: null,
          closeStatus: null,
          closeEvent: null,
          historyLength: null,
          parentExecutionInfo: null,
          executionTime: null,
          memo: null,
          searchAttributes: null,
          autoResetPoints: null,
          taskList: '',
          isCron: null,
          updateTime: null,
          partitionConfig: null,
        },
        pendingActivities: [],
        pendingChildren: [],
        pendingDecision: null,
      };
      return NextResponse.json(res);
    } catch (e) {
      logger.error<RouteHandlerErrorPayload>(
        { requestParams: decodedParams, cause: e },
        'Error fetching workflow execution info'
      );

      return NextResponse.json(
        {
          message:
            e instanceof GRPCError
              ? e.message
              : 'Error fetching workflow execution info',
          cause: e,
        },
        { status: getHTTPStatusCode(e) }
      );
    }
  }
}
