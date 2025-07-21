import { type ZodError, type z } from 'zod';

import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

import type workflowDiagnosticsIssueSchema from './schemas/workflow-diagnostics-issue-schema';
import type workflowDiagnosticsResultSchema from './schemas/workflow-diagnostics-result-schema';
import type workflowDiagnosticsRootCauseSchema from './schemas/workflow-diagnostics-root-cause-schema';

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

export type WorkflowDiagnosticsIssue = z.infer<
  typeof workflowDiagnosticsIssueSchema
>;

export type WorkflowDiagnosticsRootCause = z.infer<
  typeof workflowDiagnosticsRootCauseSchema
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
