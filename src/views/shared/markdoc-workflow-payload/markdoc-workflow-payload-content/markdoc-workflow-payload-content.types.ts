import { type WorkflowPayloadKind } from '../markdoc-workflow-payload.types';

export type Props = {
  kind: WorkflowPayloadKind;
  workflowId: string;
  runId: string;
  domain: string;
  cluster: string;
  path?: string;
  name?: string;
};
