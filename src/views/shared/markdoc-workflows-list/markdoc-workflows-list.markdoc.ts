import { type Schema } from '@markdoc/markdoc';

export const workflowsListMarkdocSchema: Schema = {
  render: 'MarkdocWorkflowsList',
  selfClosing: true,
  attributes: {
    query: { type: String, required: true },
    columns: { type: String, required: false },
    domain: { type: String, required: false },
    cluster: { type: String, required: false },
  },
};
