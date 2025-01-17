import { MdHighlightOff, MdPowerSettingsNew } from 'react-icons/md';

import { type CancelWorkflowResponse } from '@/route-handlers/cancel-workflow/cancel-workflow.types';
import { type TerminateWorkflowResponse } from '@/route-handlers/terminate-workflow/terminate-workflow.types';

import getWorkflowIsCompleted from '../../workflow-page/helpers/get-workflow-is-completed';
import { type WorkflowAction } from '../workflow-actions.types';

const workflowActionsConfig: [
  WorkflowAction<CancelWorkflowResponse>,
  WorkflowAction<TerminateWorkflowResponse>,
] = [
  {
    id: 'cancel',
    label: 'Cancel',
    subtitle: 'Cancel a workflow execution',
    icon: MdHighlightOff,
    getIsEnabled: (workflow) =>
      !getWorkflowIsCompleted(
        workflow.workflowExecutionInfo?.closeEvent?.attributes ?? ''
      ),
    apiRoute: 'cancel',
    getSuccessMessage: () => 'Workflow cancellation has been requested.',
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
    apiRoute: 'terminate',
    getSuccessMessage: () => 'Workflow has been terminated.',
  },
] as const;

export default workflowActionsConfig;
