import { type WorkflowHistoryEventFilteringType } from '@/views/workflow-history/workflow-history-filters-type/workflow-history-filters-type.types';

import { type WorkflowHistoryEventFilteringTypeColors } from '../workflow-history-v2.types';

const workflowHistoryEventFilteringTypeColorsConfig = {
  ACTIVITY: {
    content: '#068BEE',
    background: '#EFF4FE',
    backgroundHighlighted: '#DEE9FE',
  },
  DECISION: {
    content: '#FFB48C',
    background: '#FFF0E9',
    backgroundHighlighted: '#FEE2D4',
  },
  SIGNAL: {
    content: '#C490F9',
    background: '#F9F1FF',
    backgroundHighlighted: '#F2E3FF',
  },
  TIMER: {
    content: '#F877D2',
    background: '#FEEFF9',
    backgroundHighlighted: '#FEDFF3',
  },
  CHILDWORKFLOW: {
    content: '#77D5E3',
    background: '#E2F8FB',
    backgroundHighlighted: '#CDEEF3',
  },
  WORKFLOW: {
    content: '#77B71C',
    background: '#EEF6E3',
    backgroundHighlighted: '#DEEEC6',
  },
} as const satisfies Record<
  WorkflowHistoryEventFilteringType,
  WorkflowHistoryEventFilteringTypeColors
>;

export default workflowHistoryEventFilteringTypeColorsConfig;
