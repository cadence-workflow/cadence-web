import {
<<<<<<<< HEAD:src/views/workflow-history-v2/config/workflow-history-event-group-category-colors.config.ts
  type EventGroupCategoryColors,
  type EventGroupCategory,
} from '../workflow-history-filters-menu/workflow-history-filters-menu.types';

const workflowHistoryEventGroupCategoryColorsConfig = {
========
  type WorkflowHistoryGroupFilteringTypeColors,
  type WorkflowHistoryGroupFilterType,
} from '../workflow-history-filters-menu/workflow-history-filters-menu.types';

const workflowHistoryGroupFilteringTypeColorsConfig = {
>>>>>>>> f916766c (Fix filters to not use old group type):src/views/workflow-history-v2/config/workflow-history-group-filtering-type-colors.config.ts
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
<<<<<<<< HEAD:src/views/workflow-history-v2/config/workflow-history-event-group-category-colors.config.ts
} as const satisfies Record<EventGroupCategory, EventGroupCategoryColors>;

export default workflowHistoryEventGroupCategoryColorsConfig;
========
} as const satisfies Record<
  WorkflowHistoryGroupFilterType,
  WorkflowHistoryGroupFilteringTypeColors
>;

export default workflowHistoryGroupFilteringTypeColorsConfig;
>>>>>>>> f916766c (Fix filters to not use old group type):src/views/workflow-history-v2/config/workflow-history-group-filtering-type-colors.config.ts
