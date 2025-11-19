import { type WorkflowHistoryEventFilteringType } from '@/views/workflow-history/workflow-history-filters-type/workflow-history-filters-type.types';

import { type WorkflowHistoryEventFilteringTypeColors } from '../workflow-history-v2.types';

const workflowHistoryEventFilteringTypeColorsConfig = {
  ACTIVITY: {
    content: '#068BEE',
    background: '#EFF4FE',
    backgroundHighlighted: '#DEE9FE',
  },
  DECISION: {
    content: '#FC823A',
    background: '#FFF0E9',
    backgroundHighlighted: '#FEE2D4',
  },
  SIGNAL: {
    content: '#C490F9',
    background: '',
    backgroundHighlighted: '',
  },
  TIMER: {
    content: '#F877D2',
    background: '',
    backgroundHighlighted: '',
  },
  CHILDWORKFLOW: {
    content: '#77D5E3',
    background: '',
    backgroundHighlighted: '',
  },
  WORKFLOW: {
    content: '#77D5E3',
    background: '',
    backgroundHighlighted: '',
  },
} as const satisfies Record<
  WorkflowHistoryEventFilteringType,
  WorkflowHistoryEventFilteringTypeColors
>;

export default workflowHistoryEventFilteringTypeColorsConfig;
