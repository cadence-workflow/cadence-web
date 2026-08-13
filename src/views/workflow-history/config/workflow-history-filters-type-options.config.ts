import { createElement } from 'react';

import { MdCircle } from 'react-icons/md';

import { type TagFilterOptionConfig } from '@/components/tag-filter/tag-filter.types';

import { type EventGroupCategory } from '../workflow-history-filters-menu/workflow-history-filters-menu.types';

import workflowHistoryEventGroupCategoryColorsConfig from './workflow-history-event-group-category-colors.config';

const workflowHistoryFiltersTypeOptionsConfig = {
  ACTIVITY: {
    label: 'Activity',
    startEnhancer: () =>
      createElement(MdCircle, {
        color: workflowHistoryEventGroupCategoryColorsConfig.ACTIVITY.content,
      }),
  },
  DECISION: {
    label: 'Decision',
    startEnhancer: () =>
      createElement(MdCircle, {
        color: workflowHistoryEventGroupCategoryColorsConfig.DECISION.content,
      }),
  },
  SIGNAL: {
    label: 'Signal',
    startEnhancer: () =>
      createElement(MdCircle, {
        color: workflowHistoryEventGroupCategoryColorsConfig.SIGNAL.content,
      }),
  },
  TIMER: {
    label: 'Timer',
    startEnhancer: () =>
      createElement(MdCircle, {
        color: workflowHistoryEventGroupCategoryColorsConfig.TIMER.content,
      }),
  },
  CHILDWORKFLOW: {
    label: 'Child Workflow',
    startEnhancer: () =>
      createElement(MdCircle, {
        color:
          workflowHistoryEventGroupCategoryColorsConfig.CHILDWORKFLOW.content,
      }),
  },
  WORKFLOW: {
    label: 'Other',
    startEnhancer: () =>
      createElement(MdCircle, {
        color: workflowHistoryEventGroupCategoryColorsConfig.WORKFLOW.content,
      }),
  },
} as const satisfies Record<EventGroupCategory, TagFilterOptionConfig>;

export default workflowHistoryFiltersTypeOptionsConfig;
