import { signalWorkflowFormSchema } from '@/views/workflow-actions/workflow-action-signal-form/schemas/signal-workflow-form-schema';
import WorkflowActionSignalForm from '@/views/workflow-actions/workflow-action-signal-form/workflow-action-signal-form';

import { type BatchActionsConfirmationModalConfig } from '../domain-batch-actions.types';

const domainBatchActionsConfirmationModalConfig: BatchActionsConfirmationModalConfig =
  {
    cancel: {
      title: 'Cancel workflows',
      description:
        'Cancel running workflows by scheduling a cancellation request, giving them a chance to clean up.',
      withForm: false,
      docsLink: {
        text: 'Read more about cancelling workflows',
        href: 'https://cadenceworkflow.io/docs/cli#signal-cancel-terminate-workflow',
      },
    },
    terminate: {
      title: 'Terminate workflows',
      description:
        'Terminate running workflows immediately. Please terminate only if you know what you are doing.',
      withForm: false,
      docsLink: {
        text: 'Read more about terminating workflows',
        href: 'https://cadenceworkflow.io/docs/cli#signal-cancel-terminate-workflow',
      },
    },
    signal: {
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
    },
  };

export default domainBatchActionsConfirmationModalConfig;
