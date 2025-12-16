import { type z } from 'zod';

import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

import type signalWorkflowRequestBodySchema from './schemas/signal-workflow-request-body-schema';

export type RequestParams = {
  params: {
    domain: string;
    cluster: string;
    workflowId: string;
    runId: string;
  };
};

export type SignalWorkflowRequestBody = z.infer<
  typeof signalWorkflowRequestBodySchema
>;

export type Context = DefaultMiddlewaresContext;
