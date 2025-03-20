import {
  MdHighlightOff,
  MdPowerSettingsNew,
  MdOutlineRestartAlt,
} from 'react-icons/md';

import { type CancelWorkflowResponse } from '@/route-handlers/cancel-workflow/cancel-workflow.types';
import { type RestartWorkflowResponse } from '@/route-handlers/restart-workflow/restart-workflow.types';
import { type TerminateWorkflowResponse } from '@/route-handlers/terminate-workflow/terminate-workflow.types';

import getWorkflowIsCompleted from '../../workflow-page/helpers/get-workflow-is-completed';
import { type WorkflowAction } from '../workflow-actions.types';

const workflowActionsConfig: [
  WorkflowAction<CancelWorkflowResponse>,
  WorkflowAction<TerminateWorkflowResponse>,
  WorkflowAction<RestartWorkflowResponse>,
] = [
  {
    id: 'cancel',
    label: 'Cancel',
    subtitle: 'Cancel a workflow execution',
    modal: {
      text: "Cancels a running workflow by scheduling a cancellation request in the workflow's history, giving it a chance to clean up.",
      docsLink: {
        text: 'Read more about cancelling workflows',
        href: 'https://cadenceworkflow.io/docs/cli#signal-cancel-terminate-workflow',
      },
    },
    icon: MdHighlightOff,
    getIsRunnable: (workflow) =>
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
    modal: {
      text: 'Terminates a running workflow immediately. Please terminate a workflow only if you know what you are doing.',
      docsLink: {
        text: 'Read more about terminating workflows',
        href: 'https://cadenceworkflow.io/docs/cli#signal-cancel-terminate-workflow',
      },
    },
    icon: MdPowerSettingsNew,
    getIsRunnable: (workflow) =>
      !getWorkflowIsCompleted(
        workflow.workflowExecutionInfo?.closeEvent?.attributes ?? ''
      ),
    apiRoute: 'terminate',
    getSuccessMessage: () => 'Workflow has been terminated.',
  },
  {
    id: 'restart',
    label: 'Restart',
    subtitle: 'Restart a workflow execution',
    modal: {
      text: [
        'Restarts a workflow by creating a new execution with a fresh Run ID while using the existing input. If the previous execution is still running, it will be terminated.',
        'What differentiates Restart from Reset is that the restarted workflow is not aware of the previous workflow execution.',
      ],
    },
    icon: MdOutlineRestartAlt,
    getIsRunnable: () => true,
    apiRoute: 'restart',
    getSuccessMessage: (result) =>
      // TODO: change runid to a link (upcomming PR)
      `Workflow has been restarted with new run ID: ${result.runId}`,
  },
] as const;

export default workflowActionsConfig;
