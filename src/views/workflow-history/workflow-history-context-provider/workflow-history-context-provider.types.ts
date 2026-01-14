export type WorkflowHistoryContextType = {
  ungroupedViewUserPreference: boolean | null;
  setUngroupedViewUserPreference: (v: boolean) => void;
  // TODO @adhitya.mamallan: clean up once Workflow History V2 has been fully rolled out
  isWorkflowHistoryV2Selected: boolean;
  setIsWorkflowHistoryV2Selected: (v: boolean) => void;
};
