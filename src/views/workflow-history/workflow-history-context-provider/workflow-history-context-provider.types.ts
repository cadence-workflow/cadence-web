export type WorkflowHistoryContextType = {
  ungroupedViewUserPreference: boolean | null;
  setUngroupedViewUserPreference: (v: boolean) => void;
  // Workflow History V2 Enabled: clean up once the feature has been fully rolled out
  isWorkflowHistoryV2Enabled: boolean;
  setIsWorkflowHistoryV2Enabled: (v: boolean) => void;
};
