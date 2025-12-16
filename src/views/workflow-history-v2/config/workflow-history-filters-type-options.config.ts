import { createElement } from 'react';

import { MdCircle } from 'react-icons/md';

import { type TagFilterOptionConfig } from '@/components/tag-filter/tag-filter.types';
import { type WorkflowHistoryEventFilteringType } from '@/views/workflow-history/workflow-history-filters-type/workflow-history-filters-type.types';

import workflowHistoryEventFilteringTypeColorsConfig from './workflow-history-event-filtering-type-colors.config';

const workflowHistoryFiltersTypeOptionsConfig = {
  ACTIVITY: {
    label: 'Activity',
    startEnhancer: () =>
      createElement(MdCircle, {
        color: workflowHistoryEventFilteringTypeColorsConfig.ACTIVITY.content,
      }),
  },
  DECISION: {
    label: 'Decision',
    startEnhancer: () =>
      createElement(MdCircle, {
        color: workflowHistoryEventFilteringTypeColorsConfig.DECISION.content,
      }),
  },
  SIGNAL: {
    label: 'Signal',
    startEnhancer: () =>
      createElement(MdCircle, {
        color: workflowHistoryEventFilteringTypeColorsConfig.SIGNAL.content,
      }),
  },
  TIMER: {
    label: 'Timer',
    startEnhancer: () =>
      createElement(MdCircle, {
        color: workflowHistoryEventFilteringTypeColorsConfig.TIMER.content,
      }),
  },
  CHILDWORKFLOW: {
    label: 'Child Workflow',
    startEnhancer: () =>
      createElement(MdCircle, {
        color:
          workflowHistoryEventFilteringTypeColorsConfig.CHILDWORKFLOW.content,
      }),
  },
  WORKFLOW: {
    label: 'Other',
    startEnhancer: () =>
      createElement(MdCircle, {
        color: workflowHistoryEventFilteringTypeColorsConfig.WORKFLOW.content,
      }),
  },
} as const satisfies Record<
  WorkflowHistoryEventFilteringType,
  TagFilterOptionConfig
>;

export default workflowHistoryFiltersTypeOptionsConfig;
