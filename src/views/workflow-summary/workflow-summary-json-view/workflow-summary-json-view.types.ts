import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';
import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

export type WorkflowSummaryJsonTab = 'input' | 'result';

export type Props = {
  inputJson: PrettyJsonValue;
  resultJson: PrettyJsonValue;
  isWorkflowRunning: boolean;
  isArchived: boolean;
  defaultTab?: WorkflowSummaryJsonTab;
  hideTabToggle?: boolean;
} & WorkflowPageParams;
