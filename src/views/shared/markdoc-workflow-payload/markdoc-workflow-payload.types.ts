export type WorkflowPayloadKind = 'input' | 'result' | 'searchAttributes';

export type Props = {
  kind: WorkflowPayloadKind;
  workflowId?: string;
  runId?: string;
  domain?: string;
  cluster?: string;
  path?: string;
  name?: string;
};
