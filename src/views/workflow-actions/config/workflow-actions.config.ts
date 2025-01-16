import { MdHighlightOff, MdPowerSettingsNew } from 'react-icons/md';

import getWorkflowIsCompleted from '@/views/workflow-page/helpers/get-workflow-is-completed';

import { type WorkflowAction } from '../workflow-actions.types';

const workflowActionsConfig = [
  {
    id: 'cancel',
    label: 'Cancel',
    subtitle: 'Cancel a workflow execution',
    icon: MdHighlightOff,
    getIsEnabled: (workflow) =>
      !getWorkflowIsCompleted(
        workflow.workflowExecutionInfo?.closeEvent?.attributes ?? ''
      ),
  },
  {
    id: 'terminate',
    label: 'Terminate',
    subtitle: 'Terminate a workflow execution',
    icon: MdPowerSettingsNew,
    getIsEnabled: (workflow) =>
      !getWorkflowIsCompleted(
        workflow.workflowExecutionInfo?.closeEvent?.attributes ?? ''
      ),
  },
] as const satisfies Array<WorkflowAction>;

export default workflowActionsConfig;
