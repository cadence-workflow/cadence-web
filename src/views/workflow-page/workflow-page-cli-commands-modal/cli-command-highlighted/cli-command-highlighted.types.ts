import type { WorkflowPageParams } from '../../workflow-page.types';

export type Props = {
  command: string;
  params: Partial<WorkflowPageParams>;
  highlightClassName: string;
};
