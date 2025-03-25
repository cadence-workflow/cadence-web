import { MdHighlightOff, MdPowerSettingsNew } from 'react-icons/md';

import { type CancelWorkflowResponse } from '@/route-handlers/cancel-workflow/cancel-workflow.types';
import { type TerminateWorkflowResponse } from '@/route-handlers/terminate-workflow/terminate-workflow.types';

import { WORKFLOW_ACTION_RUN_STATUSES } from '../workflow-actions.constants';
import { type WorkflowAction } from '../workflow-actions.types';

export const mockWorkflowActionsConfig: [
  WorkflowAction<CancelWorkflowResponse>,
  WorkflowAction<TerminateWorkflowResponse>,
] = [
  {
    id: 'cancel',
    label: 'Mock cancel',
    subtitle: 'Mock cancel a workflow execution',
    modal: {
      text: 'Mock modal text to cancel a workflow execution',
      docsLink: {
        text: 'Mock docs link',
        href: 'https://mock.docs.link',
      },
    },
    icon: MdHighlightOff,
    getRunStatus: () => WORKFLOW_ACTION_RUN_STATUSES.runnable,
    apiRoute: 'cancel',
    renderSuccessMessage: () => 'Mock cancel notification',
  },
  {
    id: 'terminate',
    label: 'Mock terminate',
    subtitle: 'Mock terminate a workflow execution',
    modal: {
      text: 'Mock modal text to terminate a workflow execution',
      docsLink: {
        text: 'Mock docs link',
        href: 'https://mock.docs.link',
      },
    },
    icon: MdPowerSettingsNew,
    getRunStatus: () => WORKFLOW_ACTION_RUN_STATUSES.runnable,
    apiRoute: 'terminate',
    renderSuccessMessage: () => 'Mock terminate notification',
  },
] as const;
