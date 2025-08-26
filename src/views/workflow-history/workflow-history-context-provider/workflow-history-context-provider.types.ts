import { type WorkflowHistoryEventFilteringType } from '../workflow-history-filters-type/workflow-history-filters-type.types';

export type WorkflowHistoryContextType = {
  ungroupedViewUserPreference: boolean | null;
  setUngroupedViewUserPreference: (v: boolean) => void;
};
