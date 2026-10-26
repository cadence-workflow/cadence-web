import { type ComponentType } from 'react';

import { type Config } from '@markdoc/markdoc';

import MarkdocWorkflowsList from '../markdoc-workflows-list/markdoc-workflows-list';
import { workflowsListMarkdocSchema } from '../markdoc-workflows-list/markdoc-workflows-list.markdoc';

export const CADENCE_MARKDOC_TAGS: NonNullable<Config['tags']> = {
  workflows: workflowsListMarkdocSchema,
};

export const CADENCE_MARKDOC_COMPONENTS: Record<string, ComponentType<any>> = {
  MarkdocWorkflowsList,
};
