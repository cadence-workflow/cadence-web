const workflowHistoryUserPreferencesKeys = {
  UNGROUPED_VIEW_ENABLED: 'history-ungrouped-view-enabled',
  HISTORY_EVENT_TYPES: 'history-event-types',
} as const satisfies Record<string, string>;

export default workflowHistoryUserPreferencesKeys;
