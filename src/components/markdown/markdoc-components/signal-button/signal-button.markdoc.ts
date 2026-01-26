export const signalButtonMarkdocSchema = {
  render: 'SignalButton',
  attributes: {
    signalName: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    input: {
      type: Object,
      required: false,
    },
    domain: {
      type: String,
      required: false,
    },
    cluster: {
      type: String,
      required: false,
    },
    workflowId: {
      type: String,
      required: false,
    },
    runId: {
      type: String,
      required: false,
    },
  },
};
