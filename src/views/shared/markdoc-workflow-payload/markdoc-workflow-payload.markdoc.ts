import { type Schema, Tag } from '@markdoc/markdoc';

import { type WorkflowPayloadKind } from './markdoc-workflow-payload.types';

const attributes = {
  workflowId: { type: String, required: false },
  runId: { type: String, required: false },
  domain: { type: String, required: false },
  cluster: { type: String, required: false },
  path: { type: String, required: false },
};

const getSchema = (
  kind: WorkflowPayloadKind,
  schemaAttributes: Schema['attributes']
): Schema => ({
  selfClosing: true,
  attributes: schemaAttributes,
  transform: (node, config) =>
    new Tag('MarkdocWorkflowPayload', {
      ...node.transformAttributes(config),
      kind,
    }),
});

export const workflowSearchAttributesMarkdocSchema = getSchema(
  'searchAttributes',
  {
    workflowId: attributes.workflowId,
    runId: attributes.runId,
    domain: attributes.domain,
    cluster: attributes.cluster,
    name: { type: String, required: false },
  }
);

export const workflowInputMarkdocSchema = getSchema('input', attributes);

export const workflowResultMarkdocSchema = getSchema('result', attributes);
