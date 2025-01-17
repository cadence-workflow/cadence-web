import { MdHighlightOff, MdPowerSettingsNew } from 'react-icons/md';

import { type CancelWorkflowResponse } from '@/route-handlers/cancel-workflow/cancel-workflow.types';
import { type TerminateWorkflowResponse } from '@/route-handlers/terminate-workflow/terminate-workflow.types';

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
      text: 'Mock cancel a workflow execution',
      docsLink: {
        text: 'Mock docs link',
        href: 'https://mock.docs.link',
      },
    },
    icon: MdHighlightOff,
    getIsEnabled: () => true,
    apiRoute: 'cancel',
    getSuccessMessage: () => 'Mock cancel notification',
  },
  {
    id: 'terminate',
    label: 'Mock terminate',
    subtitle: 'Mock terminate a workflow execution',
    modal: {
      text: 'Mock terminate a workflow execution',
      docsLink: {
        text: 'Mock docs link',
        href: 'https://mock.docs.link',
      },
    },
    icon: MdPowerSettingsNew,
    getIsEnabled: () => false,
    apiRoute: 'terminate',
    getSuccessMessage: () => 'Mock terminate notification',
  },
] as const;
