/** Stable ids for advanced create-schedule horizontal fields. */
export const CREATE_SCHEDULE_ADVANCED_FIELD_IDS = {
  scheduleId: 'domain-schedules-create-form-schedule-id',
  jitterSeconds: 'domain-schedules-create-form-jitter-seconds',
  workflowIdPrefix: 'domain-schedules-create-form-workflow-id-prefix',
} as const;

export const CREATE_SCHEDULE_ADVANCED_FIELD_DESCRIPTIONS = {
  scheduleId: 'Unique name provided by users to name the schedule.',
  jitterSeconds:
    'Time range to distribute starting workflows across. This helps avoiding burst of workflow creations in a single point of time.',
  workflowIdPrefix:
    'Prefix text to add into started workflows. Ids are formed as `${Prefix}+{auto generated postfix}`.',
} as const;
