export type Props = {
  domain: string;
  cluster: string;
};

export type ArchivalLookupConfig = {
  title: string;
  description: string;
  workflowIdLabel: string;
  workflowIdPlaceholder: string;
  runIdLabel: string;
  runIdPlaceholder: string;
  submitButtonLabel: string;
};

export type ArchivalLookupFormValues = {
  workflowId: string;
  runId: string;
};
