import {
  MdOutlineWarningAmber,
  MdPauseCircleOutline,
  MdPlayCircleOutline,
} from 'react-icons/md';
import { z } from 'zod';

import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
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
  undefined,
  { reason: string }
> = {
  id: 'pause',
  label: 'Mock pause',
  subtitle: 'Mock pause a schedule',
  modal: {
    banner: {
      kind: 'warning',
      icon: MdOutlineWarningAmber,
      render: () => 'Mock pause banner message',
    },
    withForm: false,
  },
  icon: MdPauseCircleOutline,
  getRunnableStatus: (schedule) =>
    schedule.state?.paused
      ? 'NOT_RUNNABLE_SCHEDULE_ALREADY_PAUSED'
      : 'RUNNABLE',
  apiRoute: mockActionApiRoute('pause'),
  getConfirmSubmissionData: () => ({ reason: 'Mock pause reason' }),
  renderSuccessMessage: () => 'Mock pause notification',
};

export const mockResumeActionConfig: ScheduleAction<
  UnpauseScheduleResponse,
  { reason?: string; catchUpPolicy?: ScheduleCatchUpPolicy },
  { reason?: string; catchUpPolicy?: ScheduleCatchUpPolicy }
> = {
  id: 'resume',
  label: 'Mock resume',
  subtitle: 'Mock resume a schedule',
  modal: {
    withForm: true,
    form: ({ control, fieldErrors }) => (
      <div data-testid="mock-resume-form">
        <input
          data-testid="mock-resume-reason"
          aria-label="Reason (optional)"
          aria-invalid={!!fieldErrors.reason}
          {...control.register('reason')}
        />
      </div>
    ),
    formSchema: z.object({
      reason: z.string().optional(),
      catchUpPolicy: z.nativeEnum(ScheduleCatchUpPolicy).optional(),
    }),
    transformFormDataToSubmission: (formData) => ({
      ...(formData.reason?.trim() ? { reason: formData.reason.trim() } : {}),
      ...(formData.catchUpPolicy
        ? { catchUpPolicy: formData.catchUpPolicy }
        : {}),
    }),
    initialFormValues: { reason: '' },
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
