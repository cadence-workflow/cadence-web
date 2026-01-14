export type WorkflowHistoryContextType = {
  ungroupedViewUserPreference: boolean | null;
  setUngroupedViewUserPreference: (v: boolean) => void;
  // TODO @adhitya.mamallan: clean up once Workflow History V2 has been fully rolled out
  isWorkflowHistoryV2Enabled: boolean;
  setIsWorkflowHistoryV2Enabled: (v: boolean) => void;
};
