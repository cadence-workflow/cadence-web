import { MdHighlightOff, MdPowerSettingsNew } from 'react-icons/md';

import { type WorkflowAction } from '../workflow-page-actions-menu/workflow-page-actions-menu.types';

export const mockWorkflowPageActionsConfig = [
  {
    id: 'cancel',
    label: 'Mock cancel',
    subtitle: 'Mock cancel a workflow execution',
    icon: MdHighlightOff,
    getIsEnabled: () => true,
  },
  {
    id: 'terminate',
    label: 'Mock terminate',
    subtitle: 'Mock terminate a workflow execution',
    icon: MdPowerSettingsNew,
    getIsEnabled: () => false,
  },
] as const satisfies Array<WorkflowAction>;
