import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';

export type Props = {
  inputJson: PrettyJsonValue;
  resultJson: PrettyJsonValue;
  isWorkflowRunning: boolean;
  isArchived: boolean;
  domain: string;
  cluster: string;
  runId: string;
  workflowId: string;
};
