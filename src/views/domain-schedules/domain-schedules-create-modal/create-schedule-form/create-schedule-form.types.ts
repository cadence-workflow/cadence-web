import { type Control, type FieldErrors } from 'react-hook-form';

import {
  type SCHEDULE_CATCH_UP_POLICIES,
  type SCHEDULE_OVERLAP_POLICIES,
} from '@/route-handlers/create-schedule/create-schedule.constants';
import { type WORKER_SDK_LANGUAGES } from '@/route-handlers/start-workflow/start-workflow.constants';
import { type CronScheduleValue } from '@/components/cron-schedule-input/cron-schedule-input.types';

export type CreateScheduleFormData = {
  cronExpression: Partial<CronScheduleValue>;
  workflowType: { name: string };
  taskList: { name: string };
  executionStartToCloseTimeoutSeconds: number | undefined;
  taskStartToCloseTimeoutSeconds: number | undefined;
  workflowIdPrefix: string;
  workerSDKLanguage: (typeof WORKER_SDK_LANGUAGES)[number];
  input: string[];
  overlapPolicy: (typeof SCHEDULE_OVERLAP_POLICIES)[number];
  catchUpPolicy: (typeof SCHEDULE_CATCH_UP_POLICIES)[number];
  catchUpWindowDays: number;
  bufferLimit: number;
  pauseOnFailure: boolean;
};

export type Props = {
  control: Control<CreateScheduleFormData>;
  fieldErrors: FieldErrors<CreateScheduleFormData>;
  catchUpPolicy: (typeof SCHEDULE_CATCH_UP_POLICIES)[number];
};
