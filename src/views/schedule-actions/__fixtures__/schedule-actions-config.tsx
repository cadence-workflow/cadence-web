import { MdOutlineWarningAmber, MdPauseCircleOutline, MdPlayCircleOutline } from 'react-icons/md';

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
      icon: ({ size }) => <MdOutlineWarningAmber size={size} />,
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
