import { type Schema } from '@markdoc/markdoc';

const attributes = {
  workflowId: { type: String, required: false },
  runId: { type: String, required: false },
  domain: { type: String, required: false },
  cluster: { type: String, required: false },
  path: { type: String, required: false },
};

export const workflowSearchAttributesMarkdocSchema: Schema = {
  render: 'MarkdocWorkflowSearchAttributes',
  selfClosing: true,
  attributes: {
    workflowId: attributes.workflowId,
    runId: attributes.runId,
    domain: attributes.domain,
    cluster: attributes.cluster,
    name: { type: String, required: false },
  },
};

export const workflowInputMarkdocSchema: Schema = {
  render: 'MarkdocWorkflowInput',
  selfClosing: true,
  attributes,
};

export const workflowResultMarkdocSchema: Schema = {
  render: 'MarkdocWorkflowResult',
  selfClosing: true,
  attributes,
};
