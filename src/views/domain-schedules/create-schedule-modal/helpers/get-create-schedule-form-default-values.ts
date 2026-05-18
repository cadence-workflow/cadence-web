import {
  SCHEDULE_CATCH_UP_POLICIES,
  SCHEDULE_OVERLAP_POLICIES,
} from '@/route-handlers/create-schedule/create-schedule.constants';
import { WORKER_SDK_LANGUAGES } from '@/route-handlers/start-workflow/start-workflow.constants';

import { CATCH_UP_WINDOW_DEFAULT_DAYS } from '../create-schedule-modal.constants';
import { type CreateScheduleFormData } from '../create-schedule-form/create-schedule-form.types';

export default function getCreateScheduleFormDefaultValues(): CreateScheduleFormData {
  return {
    cronExpression: {
      minutes: '0',
      hours: '9',
      daysOfMonth: '*',
      months: '*',
      daysOfWeek: '*',
    },
    workflowType: { name: '' },
    taskList: { name: '' },
    executionStartToCloseTimeoutSeconds: 3600,
    taskStartToCloseTimeoutSeconds: 60,
    workflowIdPrefix: '',
    workerSDKLanguage: WORKER_SDK_LANGUAGES[0],
    input: [''],
    overlapPolicy: SCHEDULE_OVERLAP_POLICIES[0],
    catchUpPolicy: SCHEDULE_CATCH_UP_POLICIES[0],
    catchUpWindowDays: CATCH_UP_WINDOW_DEFAULT_DAYS,
    bufferLimit: 0,
    pauseOnFailure: false,
  };
}
