import { type ComponentType } from 'react';

import { type Config } from '@markdoc/markdoc';

import MarkdocWorkflowInput from '../markdoc-workflow-payload/markdoc-workflow-input';
import {
  workflowInputMarkdocSchema,
  workflowResultMarkdocSchema,
  workflowSearchAttributesMarkdocSchema,
} from '../markdoc-workflow-payload/markdoc-workflow-payload.markdoc';
import MarkdocWorkflowResult from '../markdoc-workflow-payload/markdoc-workflow-result';
import MarkdocWorkflowSearchAttributes from '../markdoc-workflow-payload/markdoc-workflow-search-attributes';
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
  MarkdocWorkflowInput,
  MarkdocWorkflowResult,
  MarkdocWorkflowSearchAttributes,
};
