import {
  MdOutlineWarningAmber,
  MdPauseCircleOutline,
  MdPlayCircleOutline,
} from 'react-icons/md';
import { z } from 'zod';

import { type PauseScheduleResponse } from '@/route-handlers/pause-schedule/pause-schedule.types';
import { type UnpauseScheduleResponse } from '@/route-handlers/unpause-schedule/unpause-schedule.types';

import {
  type ScheduleAction,
  type ScheduleActionInputParams,
} from '../schedule-actions.types';

const mockActionApiRoute =
  (action: string) => (params: ScheduleActionInputParams) =>
    `/api/domains/${params.domain}/${params.cluster}/schedules/${params.scheduleId}/${action}`;

export const mockPauseActionConfig: ScheduleAction<
  PauseScheduleResponse,
  { reason: string },
  { reason: string }
> = {
  id: 'pause',
  label: 'Mock pause',
  subtitle: 'Mock pause a schedule',
  modal: {
    banner: {
      kind: 'warning',
      icon: ({ size, color }) => (
        <MdOutlineWarningAmber size={size} color={color} />
      ),
      render: () => 'Mock pause banner message',
    },
    withForm: true,
    form: ({ control, fieldErrors }) => (
      <div data-testid="mock-pause-form">
        <input
          data-testid="mock-pause-reason"
          aria-label="Reason"
          aria-invalid={!!fieldErrors.reason}
          {...control.register('reason')}
        />
      </div>
    ),
    formSchema: z.object({
      reason: z.string().trim().min(1, 'Reason for pausing is required'),
    }),
    transformFormDataToSubmission: (formData) => formData,
    initialFormValues: { reason: '' },
  },
  icon: MdPauseCircleOutline,
  getRunnableStatus: (schedule) =>
    schedule.state?.paused
      ? 'NOT_RUNNABLE_SCHEDULE_ALREADY_PAUSED'
      : 'RUNNABLE',
  apiRoute: mockActionApiRoute('pause'),
  renderSuccessMessage: () => 'Mock pause notification',
};

export const mockResumeActionConfig: ScheduleAction<UnpauseScheduleResponse> = {
  id: 'resume',
  label: 'Mock resume',
  subtitle: 'Mock resume a schedule',
  modal: {
    withForm: false,
  },
  icon: MdPlayCircleOutline,
  getRunnableStatus: (schedule) =>
    schedule.state?.paused ? 'RUNNABLE' : 'NOT_RUNNABLE_SCHEDULE_NOT_PAUSED',
  apiRoute: mockActionApiRoute('unpause'),
  renderSuccessMessage: () => 'Mock resume notification',
};

export const mockScheduleActionsConfig = [
  mockPauseActionConfig,
  mockResumeActionConfig,
] as const;
