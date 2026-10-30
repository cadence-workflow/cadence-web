export type WorkflowPayloadKind = 'input' | 'result' | 'searchAttributes';

export type TagProps = {
  workflowId?: string;
  runId?: string;
  domain?: string;
  cluster?: string;
  path?: string;
};

export type SearchAttributesTagProps = Omit<TagProps, 'path'> & {
  name?: string;
};

export type Props = TagProps & {
  name?: string;
  kind: WorkflowPayloadKind;
};

export type ContentProps = {
  kind: WorkflowPayloadKind;
  workflowId: string;
  runId: string;
  domain: string;
  cluster: string;
  path?: string;
  name?: string;
};
