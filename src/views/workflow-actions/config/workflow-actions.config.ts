import { createElement } from 'react';

import {
  MdHighlightOff,
  MdPowerSettingsNew,
  MdOutlineRestartAlt,
  MdRefresh,
  MdOutlineWifiTethering,
  MdOutlinePlayArrow,
} from 'react-icons/md';

import { type CancelWorkflowResponse } from '@/route-handlers/cancel-workflow/cancel-workflow.types';
import { type ResetWorkflowResponse } from '@/route-handlers/reset-workflow/reset-workflow.types';
import { type RestartWorkflowResponse } from '@/route-handlers/restart-workflow/restart-workflow.types';
import { type StartWorkflowResponse } from '@/route-handlers/start-workflow/start-workflow.types';
import { type TerminateWorkflowResponse } from '@/route-handlers/terminate-workflow/terminate-workflow.types';

import getWorkflowIsCompleted from '../../workflow-page/helpers/get-workflow-is-completed';
import WorkflowActionNewRunSuccessMsg from '../workflow-action-new-run-success-msg/workflow-action-new-run-success-msg';
import { resetWorkflowFormSchema } from '../workflow-action-reset-form/schemas/reset-workflow-form-schema';
import WorkflowActionResetForm from '../workflow-action-reset-form/workflow-action-reset-form';
import {
  type ResetWorkflowSubmissionData,
  type ResetWorkflowFormData,
} from '../workflow-action-reset-form/workflow-action-reset-form.types';
import { signalWorkflowFormSchema } from '../workflow-action-signal-form/schemas/signal-workflow-form-schema';
import WorkflowActionSignalForm from '../workflow-action-signal-form/workflow-action-signal-form';
import {
  type SignalWorkflowSubmissionData,
  type SignalWorkflowFormData,
} from '../workflow-action-signal-form/workflow-action-signal-form.types';
import transformStartWorkflowFormToSubmission from '../workflow-action-start-form/helpers/transform-start-workflow-form-to-submission';
import { startWorkflowFormSchema } from '../workflow-action-start-form/schemas/start-workflow-form-schema';
import WorkflowActionStartForm from '../workflow-action-start-form/workflow-action-start-form';
import {
  type StartWorkflowSubmissionData,
  type StartWorkflowFormData,
} from '../workflow-action-start-form/workflow-action-start-form.types';
import { type WorkflowAction } from '../workflow-actions.types';

const cancelWorkflowActionConfig: WorkflowAction<CancelWorkflowResponse> = {
  id: 'cancel',
  label: 'Cancel',
  subtitle: 'Cancel a workflow execution',
  modal: {
    text: "Cancels a running workflow by scheduling a cancellation request in the workflow's history, giving it a chance to clean up.",
    docsLink: {
      text: 'Read more about cancelling workflows',
      href: 'https://cadenceworkflow.io/docs/cli#signal-cancel-terminate-workflow',
    },
    withForm: false,
  },
  icon: MdHighlightOff,
  getRunnableStatus: (workflow) =>
    getWorkflowIsCompleted(
      workflow.workflowExecutionInfo?.closeEvent?.attributes ?? ''
    )
      ? 'NOT_RUNNABLE_WORKFLOW_CLOSED'
      : 'RUNNABLE',
  apiRoute: (params) =>
    `/api/domains/${params.domain}/${params.cluster}/workflows/${params.workflowId}/${params.runId}/cancel`,
  renderSuccessMessage: () => 'Workflow cancellation has been requested.',
};

const terminateWorkflowActionConfig: WorkflowAction<TerminateWorkflowResponse> =
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
      withForm: false,
    },
    icon: MdPowerSettingsNew,
    getRunnableStatus: (workflow) =>
      getWorkflowIsCompleted(
        workflow.workflowExecutionInfo?.closeEvent?.attributes ?? ''
      )
        ? 'NOT_RUNNABLE_WORKFLOW_CLOSED'
        : 'RUNNABLE',
    apiRoute: (params) =>
      `/api/domains/${params.domain}/${params.cluster}/workflows/${params.workflowId}/${params.runId}/terminate`,
    renderSuccessMessage: () => 'Workflow has been terminated.',
  };

const signalWorkflowActionConfig: WorkflowAction<
  unknown,
  SignalWorkflowFormData,
  SignalWorkflowSubmissionData
> = {
  id: 'signal',
  label: 'Signal',
  subtitle: 'Send a signal to the workflow',
  modal: {
    text: 'Provide data to running workflows using signals',
    docsLink: {
      text: 'Learn more about signals',
      href: 'https://cadenceworkflow.io/docs/go-client/signals',
    },
    withForm: true,
    form: WorkflowActionSignalForm,
    formSchema: signalWorkflowFormSchema,
    transformFormDataToSubmission: (formData) => formData,
  },
  icon: MdOutlineWifiTethering,
  getRunnableStatus: (workflow) =>
    getWorkflowIsCompleted(
      workflow.workflowExecutionInfo?.closeEvent?.attributes ?? ''
    )
      ? 'NOT_RUNNABLE_WORKFLOW_CLOSED'
      : 'RUNNABLE',
  apiRoute: (params) =>
    `/api/domains/${params.domain}/${params.cluster}/workflows/${params.workflowId}/${params.runId}/signal`,
  renderSuccessMessage: ({ inputParams }) =>
    `Successfully sent signal "${inputParams.submissionData.signalName}"`,
};

export const startWorkflowActionConfig: WorkflowAction<
  StartWorkflowResponse,
  StartWorkflowFormData,
  StartWorkflowSubmissionData
> = {
  id: 'start',
  label: 'Start',
  subtitle: 'Start a new workflow execution',
  modal: {
    text: 'Start a new workflow execution with the specified parameters and configuration.',
    docsLink: {
      text: 'Learn more about starting workflows',
      href: 'https://cadenceworkflow.io/docs/cli#start-workflow',
    },
    withForm: true,
    form: WorkflowActionStartForm,
    formSchema: startWorkflowFormSchema,
    transformFormDataToSubmission: transformStartWorkflowFormToSubmission,
  },
  icon: MdOutlinePlayArrow,
  getRunnableStatus: () => 'RUNNABLE',
  apiRoute: (params) =>
    `/api/domains/${params.domain}/${params.cluster}/workflows/start`,
  renderSuccessMessage: (props) =>
    createElement(WorkflowActionNewRunSuccessMsg, {
      ...props,
      inputParams: {
        ...props.inputParams,
        workflowId: props.result.workflowId,
      },
      successMessage: 'Workflow has been started.',
    }),
};

const restartWorkflowActionConfig: WorkflowAction<RestartWorkflowResponse> = {
  id: 'restart',
  label: 'Restart',
  subtitle: 'Restart a workflow execution',
  modal: {
    text: [
      'Restarts a workflow by creating a new execution with a fresh Run ID while using the existing input. If the previous execution is still running, it will be terminated.',
      'What differentiates Restart from Reset is that the restarted workflow is not aware of the previous workflow execution.',
    ],
    withForm: false,
  },
  icon: MdOutlineRestartAlt,
  getRunnableStatus: () => 'RUNNABLE',
  apiRoute: (params) =>
    `/api/domains/${params.domain}/${params.cluster}/workflows/${params.workflowId}/${params.runId}/restart`,
  renderSuccessMessage: (props) =>
    createElement(WorkflowActionNewRunSuccessMsg, {
      ...props,
      successMessage: 'Workflow has been restarted.',
    }),
};

export const resetWorkflowActionConfig: WorkflowAction<
  ResetWorkflowResponse,
  ResetWorkflowFormData,
  ResetWorkflowSubmissionData
> = {
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
    withForm: true,
    form: WorkflowActionResetForm,
    formSchema: resetWorkflowFormSchema,
    transformFormDataToSubmission: (
      formData: ResetWorkflowFormData
    ): ResetWorkflowSubmissionData => {
      const decisionFinishEventId =
        formData.resetType === 'BinaryChecksum'
          ? formData.binaryChecksumFirstDecisionCompletedId
          : formData.decisionFinishEventId;
      return {
        reason: formData.reason,
        decisionFinishEventId,
        skipSignalReapply: formData.skipSignalReapply,
      };
    },
  },
  icon: MdRefresh,
  getRunnableStatus: () => 'RUNNABLE',
  apiRoute: (params) =>
    `/api/domains/${params.domain}/${params.cluster}/workflows/${params.workflowId}/${params.runId}/reset`,
  renderSuccessMessage: (props) =>
    createElement(WorkflowActionNewRunSuccessMsg, {
      ...props,
      successMessage: 'Workflow has been reset.',
    }),
};

const workflowActionsConfig = [
  cancelWorkflowActionConfig,
  terminateWorkflowActionConfig,
  signalWorkflowActionConfig,
  restartWorkflowActionConfig,
  resetWorkflowActionConfig,
  startWorkflowActionConfig,
] as const satisfies WorkflowAction<any, any, any>[];

export default workflowActionsConfig;
