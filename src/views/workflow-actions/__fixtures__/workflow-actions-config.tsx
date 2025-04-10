import { MdHighlightOff, MdPowerSettingsNew, MdRefresh } from 'react-icons/md';
import { z } from 'zod';

import { type CancelWorkflowResponse } from '@/route-handlers/cancel-workflow/cancel-workflow.types';
import { type ResetWorkflowResponse } from '@/route-handlers/reset-workflow/reset-workflow.types';
import { type TerminateWorkflowResponse } from '@/route-handlers/terminate-workflow/terminate-workflow.types';

import { type WorkflowAction } from '../workflow-actions.types';

export const mockWorkflowActionsConfig: [
  WorkflowAction<any, any, CancelWorkflowResponse>,
  WorkflowAction<any, any, TerminateWorkflowResponse>,
  WorkflowAction<
    { testField: string },
    { transformed: string },
    ResetWorkflowResponse
  >,
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
    getRunnableStatus: () => 'RUNNABLE',
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
    getRunnableStatus: () => 'RUNNABLE',
    apiRoute: 'terminate',
    renderSuccessMessage: () => 'Mock terminate notification',
  },
  {
    id: 'restart', // TODO: rename to reset
    label: 'Mock reset',
    subtitle: 'Mock reset a workflow execution',
    modal: {
      text: 'Mock modal text to reset a workflow execution',
      docsLink: {
        text: 'Mock docs link',
        href: 'https://mock.docs.link',
      },
      form: ({ control, fieldErrors }) => (
        <div data-testid="mock-form">
          <input
            data-testid="test-input"
            aria-invalid={!!fieldErrors.testField}
            {...control.register('testField')}
          />
        </div>
      ),
      formSchema: z.object({
        testField: z.string().min(1),
      }),
      transformFormDataToSubmission: (data: { testField: string }) => ({
        transformed: data.testField,
      }),
    },
    icon: MdRefresh,
    getRunnableStatus: () => 'RUNNABLE',
    apiRoute: 'reset',
    renderSuccessMessage: ({ result }) =>
      `Mock reset notification (Run ID: ${result.runId})`,
  },
] as const;
