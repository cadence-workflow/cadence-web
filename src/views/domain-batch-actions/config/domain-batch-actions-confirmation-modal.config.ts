import { type BatchActionType } from '@/route-handlers/describe-batch-action/describe-batch-action.types';
import { signalWorkflowFormSchema } from '@/views/workflow-actions/workflow-action-signal-form/schemas/signal-workflow-form-schema';
import WorkflowActionSignalForm from '@/views/workflow-actions/workflow-action-signal-form/workflow-action-signal-form';
import {
  type SignalWorkflowFormData,
  type SignalWorkflowSubmissionData,
} from '@/views/workflow-actions/workflow-action-signal-form/workflow-action-signal-form.types';

import {
  type BatchActionModalConfig,
  type BatchActionModalConfigNoForm,
  type BatchActionModalConfigWithForm,
} from '../domain-batch-actions.types';

const cancelConfig: BatchActionModalConfigNoForm = {
  title: 'Cancel workflows',
  description:
    'Cancel running workflows by scheduling a cancellation request, giving them a chance to clean up.',
  withForm: false,
  docsLink: {
    text: 'Read more about cancelling workflows',
    href: 'https://cadenceworkflow.io/docs/cli#signal-cancel-terminate-workflow',
  },
};

const terminateConfig: BatchActionModalConfigNoForm = {
  title: 'Terminate workflows',
  description:
    'Terminate running workflows immediately. Please terminate only if you know what you are doing.',
  withForm: false,
  docsLink: {
    text: 'Read more about terminating workflows',
    href: 'https://cadenceworkflow.io/docs/cli#signal-cancel-terminate-workflow',
  },
};

const signalConfig: BatchActionModalConfigWithForm<
  SignalWorkflowFormData,
  SignalWorkflowSubmissionData
> = {
  title: 'Signal workflows',
  description: 'Allow user to signal running executions.',
  withForm: true,
  form: WorkflowActionSignalForm,
  formSchema: signalWorkflowFormSchema,
  transformFormDataToSubmission: (formData) => formData,
  docsLink: {
    text: 'Learn more about signals',
    href: 'https://cadenceworkflow.io/docs/go-client/signals',
  },
};

const domainBatchActionsConfirmationModalConfig = {
  cancel: cancelConfig,
  terminate: terminateConfig,
  signal: signalConfig,
} satisfies Record<BatchActionType, BatchActionModalConfig<any, any>>;

export default domainBatchActionsConfirmationModalConfig;
