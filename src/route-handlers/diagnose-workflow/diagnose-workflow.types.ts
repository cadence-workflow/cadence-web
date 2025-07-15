import { type ZodError, type z } from 'zod';

import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

import type workflowDiagnosticsResultSchema from './schemas/workflow-diagnostics-result-schema';

export type RouteParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type WorkflowDiagnosticsResult = z.infer<
  typeof workflowDiagnosticsResultSchema
>;

export type DiagnoseWorkflowResponse =
  | {
      result: WorkflowDiagnosticsResult;
      parsingError: null;
    }
  | {
      result: any;
      parsingError: ZodError;
    };

export type Context = DefaultMiddlewaresContext;
