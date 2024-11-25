import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';

export type Props = {
  inputJson: PrettyJsonValue;
  resultJson: PrettyJsonValue;
  isWorkflowRunning: boolean;
};
