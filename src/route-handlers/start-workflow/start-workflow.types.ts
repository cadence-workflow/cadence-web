import { type z } from 'zod';

import { type StartWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/StartWorkflowExecutionResponse';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

import {
  type literalSchema,
  type jsonValueSchema,
} from './schemas/json-value-schema';
import type startWorkflowRequestBodySchema from './schemas/start-workflow-request-body-schema';
import { type WORKER_SDK_LANGUAGES } from './start-workflow.constants';

export type StartWorkflowRequestParams = {
  domain: string;
  cluster: string;
};

export type StartWorkflowRequestBody = z.infer<
  typeof startWorkflowRequestBodySchema
>;

export type StartWorkflowResponse = StartWorkflowExecutionResponse & {
  workflowId: string;
};

export type Context = DefaultMiddlewaresContext;

export type RequestParams = StartWorkflowRequestParams;

export type WorkerSDKLanguage = (typeof WORKER_SDK_LANGUAGES)[number];

export type JsonValue = z.infer<typeof jsonValueSchema>;

type Literal = z.infer<typeof literalSchema>;
export type Json = Literal | { [key: string]: Json } | Json[];
