import { MdPauseCircleOutline, MdPlayCircleOutline } from 'react-icons/md';

import { type PauseScheduleResponse } from '@/route-handlers/pause-schedule/pause-schedule.types';
import { type UnpauseScheduleResponse } from '@/route-handlers/unpause-schedule/unpause-schedule.types';

import {
  type PauseScheduleSubmissionData,
  type ScheduleAction,
} from '../schedule-actions.types';

import { pauseScheduleBannerIcon } from './schedule-actions-banner-icons';
import { PAUSE_SCHEDULE_MODAL_BANNER_MESSAGE } from './schedule-actions.constants';

const pauseScheduleActionConfig: ScheduleAction<
  PauseScheduleResponse,
  undefined,
  PauseScheduleSubmissionData
> = {
  id: 'pause',
  label: 'Pause',
  subtitle: 'Pause a schedule',
  modal: {
    banner: {
      kind: 'warning',
      icon: pauseScheduleBannerIcon,
      render: () => PAUSE_SCHEDULE_MODAL_BANNER_MESSAGE,
    },
    withForm: false,
  },
  icon: MdPauseCircleOutline,
  getRunnableStatus: (schedule) =>
    schedule.state?.paused
      ? 'NOT_RUNNABLE_SCHEDULE_ALREADY_PAUSED'
      : 'RUNNABLE',
  apiRoute: (params) =>
    `/api/domains/${encodeURIComponent(params.domain)}/${encodeURIComponent(params.cluster)}/schedules/${encodeURIComponent(params.scheduleId)}/pause`,
  getConfirmSubmissionData: () => ({
    reason: 'Paused from Cadence Web UI',
  }),
  renderSuccessMessage: () => 'Schedule has been paused.',
};

const resumeScheduleActionConfig: ScheduleAction<UnpauseScheduleResponse> = {
  id: 'resume',
  label: 'Resume',
  subtitle: 'Resume a paused schedule',
  modal: {
    withForm: false,
  },
  icon: MdPlayCircleOutline,
  getRunnableStatus: (schedule) =>
    schedule.state?.paused ? 'RUNNABLE' : 'NOT_RUNNABLE_SCHEDULE_NOT_PAUSED',
  apiRoute: (params) =>
    `/api/domains/${encodeURIComponent(params.domain)}/${encodeURIComponent(params.cluster)}/schedules/${encodeURIComponent(params.scheduleId)}/unpause`,
  renderSuccessMessage: () => 'Schedule has been resumed.',
};

const scheduleActionsConfig = [
  pauseScheduleActionConfig,
  resumeScheduleActionConfig,
] as const satisfies ScheduleAction<any, any, any>[];

export default scheduleActionsConfig;
