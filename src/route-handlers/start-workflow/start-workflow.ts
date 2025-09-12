import crypto from 'crypto';
import { NextResponse, type NextRequest } from 'next/server';

import dayjs from '@/utils/datetime/dayjs';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';
import { type RouteHandlerErrorPayload } from '@/utils/logger/logger.types';

import processWorkflowInput from './helpers/process-workflow-input';
import startWorkflowRequestBodySchema from './schemas/start-workflow-request-body-schema';
import { DEFAULT_TASK_START_TO_CLOSE_TIMEOUT_SECONDS } from './start-workflow.constants';
import { type Context, type RequestParams } from './start-workflow.types';

export async function startWorkflow(
  request: NextRequest,
  options: { params: RequestParams },
  ctx: Context
) {
  const { domain } = options.params;
  const requestBody = await request.json();
  const { data, error } = startWorkflowRequestBodySchema.safeParse(requestBody);

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid values provided for workflow start',
        validationErrors: error.errors,
      },
      { status: 400 }
    );
  }

  const {
    workflowId,
    workflowType,
    taskList,
    workerSDKLanguage,
    input,
    executionStartToCloseTimeoutSeconds,
    taskStartToCloseTimeoutSeconds,
    firstRunAt,
    cronSchedule,
  } = data;

  const resolvedWorkflowId = workflowId || crypto.randomUUID();
  const processedInput = processWorkflowInput({ input, workerSDKLanguage });
  const firstRunAtMS = dayjs(firstRunAt).valueOf();

  try {
    const response = await ctx.grpcClusterMethods.startWorkflow({
      domain,
      workflowId: resolvedWorkflowId,
      workflowType,
      taskList,
      input: processedInput
        ? { data: Buffer.from(processedInput, 'utf-8') }
        : undefined,
      executionStartToCloseTimeout: {
        seconds: executionStartToCloseTimeoutSeconds,
      },
      taskStartToCloseTimeout: {
        seconds:
          taskStartToCloseTimeoutSeconds ||
          DEFAULT_TASK_START_TO_CLOSE_TIMEOUT_SECONDS,
      },
      firstRunAt: firstRunAt
        ? {
            seconds: firstRunAtMS / 1000,
            nanos: (firstRunAtMS % 1000) * 1000000,
          }
        : undefined,
      cronSchedule,
      identity: ctx.userInfo?.id,
      requestId: crypto.randomUUID(),
    });

    return NextResponse.json({
      ...response,
      workflowId: resolvedWorkflowId,
    });
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { error: e },
      'Error starting workflow'
    );

    return NextResponse.json(
      {
        message: e instanceof GRPCError ? e.message : 'Error starting workflow',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
