import { createElement } from 'react';

import {
  MdHighlightOff,
  MdPowerSettingsNew,
  MdOutlineRestartAlt,
  MdRefresh,
} from 'react-icons/md';

import { type CancelWorkflowResponse } from '@/route-handlers/cancel-workflow/cancel-workflow.types';
import { type ResetWorkflowResponse } from '@/route-handlers/reset-workflow/reset-workflow.types';
import { type RestartWorkflowResponse } from '@/route-handlers/restart-workflow/restart-workflow.types';
import { type TerminateWorkflowResponse } from '@/route-handlers/terminate-workflow/terminate-workflow.types';

import getWorkflowIsCompleted from '../../workflow-page/helpers/get-workflow-is-completed';
import WorkflowActionNewRunSuccessMsg from '../workflow-action-new-run-success-msg/workflow-action-new-run-success-msg';
import { resetWorkflowFormSchema } from '../workflow-action-reset-form/schemas/reset-workflow-form-schema';
import WorkflowActionResetForm from '../workflow-action-reset-form/workflow-action-reset-form';
import {
  type ResetWorkflowSubmissionData,
  type ResetWorkflowFormData,
} from '../workflow-action-reset-form/workflow-action-reset-form.types';
import { type WorkflowAction } from '../workflow-actions.types';

const workflowActionsConfig: [
  WorkflowAction<any, any, CancelWorkflowResponse>,
  WorkflowAction<any, any, TerminateWorkflowResponse>,
  WorkflowAction<any, any, RestartWorkflowResponse>,
  WorkflowAction<
    ResetWorkflowFormData,
    ResetWorkflowSubmissionData,
    ResetWorkflowResponse
  >,
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
    getRunnableStatus: (workflow) =>
      getWorkflowIsCompleted(
        workflow.workflowExecutionInfo?.closeEvent?.attributes ?? ''
      )
        ? 'NOT_RUNNABLE_WORKFLOW_CLOSED'
        : 'RUNNABLE',
    apiRoute: 'cancel',
    renderSuccessMessage: () => 'Workflow cancellation has been requested.',
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
    getRunnableStatus: (workflow) =>
      getWorkflowIsCompleted(
        workflow.workflowExecutionInfo?.closeEvent?.attributes ?? ''
      )
        ? 'NOT_RUNNABLE_WORKFLOW_CLOSED'
        : 'RUNNABLE',
    apiRoute: 'terminate',
    renderSuccessMessage: () => 'Workflow has been terminated.',
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
    getRunnableStatus: () => 'RUNNABLE',
    apiRoute: 'restart',
    renderSuccessMessage: (props) =>
      createElement(WorkflowActionNewRunSuccessMsg, {
        ...props,
        successMessage: 'Workflow has been restarted.',
      }),
  },
  {
    id: 'reset',
    label: 'Reset',
    subtitle: 'Reset a workflow execution',
    modal: {
      text: [
        'Resets a workflow by creating a new execution with a fresh Run ID starting from a specific decision completion event.',
      ],
      docsLink: {
        text: 'Read more about resetting workflows',
        href: 'https://cadenceworkflow.io/docs/cli#workflow-reset',
      },
      form: WorkflowActionResetForm,
      formSchema: resetWorkflowFormSchema,
      transformFormDataToSubmission: (v) => v,
    },
    icon: MdRefresh,
    getRunnableStatus: () => 'RUNNABLE',
    apiRoute: 'reset',
    renderSuccessMessage: (props) =>
      createElement(WorkflowActionNewRunSuccessMsg, {
        ...props,
        successMessage: 'Workflow has been reset.',
      }),
  },
] as const;

export default workflowActionsConfig;
