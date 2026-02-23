import { createElement } from 'react';

import { MdCircle } from 'react-icons/md';

import { type TagFilterOptionConfig } from '@/components/tag-filter/tag-filter.types';

import { type WorkflowHistoryGroupFilterType } from '../workflow-history-filters-menu/workflow-history-filters-menu.types';

import workflowHistoryGroupFilteringTypeColorsConfig from './workflow-history-group-filtering-type-colors.config';

const workflowHistoryFiltersTypeOptionsConfig = {
  ACTIVITY: {
    label: 'Activity',
    startEnhancer: () =>
      createElement(MdCircle, {
        color: workflowHistoryGroupFilteringTypeColorsConfig.ACTIVITY.content,
      }),
  },
  DECISION: {
    label: 'Decision',
    startEnhancer: () =>
      createElement(MdCircle, {
        color: workflowHistoryGroupFilteringTypeColorsConfig.DECISION.content,
      }),
  },
  SIGNAL: {
    label: 'Signal',
    startEnhancer: () =>
      createElement(MdCircle, {
        color: workflowHistoryGroupFilteringTypeColorsConfig.SIGNAL.content,
      }),
  },
  TIMER: {
    label: 'Timer',
    startEnhancer: () =>
      createElement(MdCircle, {
        color: workflowHistoryGroupFilteringTypeColorsConfig.TIMER.content,
      }),
  },
  CHILDWORKFLOW: {
    label: 'Child Workflow',
    startEnhancer: () =>
      createElement(MdCircle, {
        color:
          workflowHistoryGroupFilteringTypeColorsConfig.CHILDWORKFLOW.content,
      }),
  },
  WORKFLOW: {
    label: 'Other',
    startEnhancer: () =>
      createElement(MdCircle, {
        color: workflowHistoryGroupFilteringTypeColorsConfig.WORKFLOW.content,
      }),
  },
} as const satisfies Record<
  WorkflowHistoryGroupFilterType,
  TagFilterOptionConfig
>;

export default workflowHistoryFiltersTypeOptionsConfig;
