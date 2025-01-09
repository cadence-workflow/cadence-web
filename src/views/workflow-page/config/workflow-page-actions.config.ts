import { MdHighlightOff, MdPowerSettingsNew } from 'react-icons/md';

import getWorkflowIsCompleted from '../helpers/get-workflow-is-completed';
import { type WorkflowAction } from '../workflow-page-actions-menu/workflow-page-actions-menu.types';

const workflowPageActionsConfig = [
  {
    id: 'cancel',
    label: 'Cancel',
    description: 'Cancel a workflow execution',
    icon: MdHighlightOff,
    getIsEnabled: (workflow) =>
      !getWorkflowIsCompleted(
        workflow.workflowExecutionInfo?.closeEvent?.attributes ?? ''
      ),
  },
  {
    id: 'terminate',
    label: 'Terminate',
    description: 'Terminate a workflow execution',
    icon: MdPowerSettingsNew,
    getIsEnabled: (workflow) =>
      !getWorkflowIsCompleted(
        workflow.workflowExecutionInfo?.closeEvent?.attributes ?? ''
      ),
  },
] as const satisfies Array<WorkflowAction>;

export default workflowPageActionsConfig;
