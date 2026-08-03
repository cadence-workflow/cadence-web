export const startWorkflowButtonMarkdocSchema = {
  render: 'StartWorkflowButton',
  attributes: {
    workflowType: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: false,
    },
    cluster: {
      type: String,
      required: false,
    },
    taskList: {
      type: String,
      required: true,
    },
    wfId: {
      type: String,
      required: false,
    },
    input: {
      type: Object,
      required: false,
    },
    timeoutSeconds: {
      type: Number,
      required: false,
    },
    sdkLanguage: {
      type: String,
      required: false,
    },
  },
};
