import { type ComponentType } from 'react';

import { type Config } from '@markdoc/markdoc';

import MarkdocWorkflowPayload from '../markdoc-workflow-payload/markdoc-workflow-payload';
import {
  workflowInputMarkdocSchema,
  workflowResultMarkdocSchema,
  workflowSearchAttributesMarkdocSchema,
} from '../markdoc-workflow-payload/markdoc-workflow-payload.markdoc';
import MarkdocWorkflowsList from '../markdoc-workflows-list/markdoc-workflows-list';
import { workflowsListMarkdocSchema } from '../markdoc-workflows-list/markdoc-workflows-list.markdoc';

export const CADENCE_MARKDOC_TAGS: NonNullable<Config['tags']> = {
  workflows: workflowsListMarkdocSchema,
  input: workflowInputMarkdocSchema,
  result: workflowResultMarkdocSchema,
  searchAttributes: workflowSearchAttributesMarkdocSchema,
};

export const CADENCE_MARKDOC_COMPONENTS: Record<string, ComponentType<any>> = {
  MarkdocWorkflowsList,
  MarkdocWorkflowPayload,
};
