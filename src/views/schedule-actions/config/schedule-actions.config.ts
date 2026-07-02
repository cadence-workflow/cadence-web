import {
  MdDeleteOutline,
  MdOutlineWarningAmber,
  MdPauseCircleOutline,
  MdPlayCircleOutline,
} from 'react-icons/md';

import { type DeleteScheduleResponse } from '@/route-handlers/delete-schedule/delete-schedule.types';
import { type PauseScheduleResponse } from '@/route-handlers/pause-schedule/pause-schedule.types';
import { type UnpauseScheduleResponse } from '@/route-handlers/unpause-schedule/unpause-schedule.types';

import {
  type PauseScheduleSubmissionData,
  type ScheduleAction,
} from '../schedule-actions.types';

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
      icon: MdOutlineWarningAmber,
      render: () =>
        'Pausing stops new executions but does not stop workflows already in progress.',
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
  // TODO: get reason from UI form
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

const deleteScheduleActionConfig: ScheduleAction<DeleteScheduleResponse> = {
  id: 'delete',
  label: 'Delete',
  subtitle: 'Delete this schedule permanently',
  modal: {
    banner: {
      kind: 'warning',
      icon: MdOutlineWarningAmber,
      render: () =>
        'Deletes the schedule permanently. In-progress workflow runs are not affected.',
    },
    withForm: false,
  },
  icon: MdDeleteOutline,
  getRunnableStatus: () => 'RUNNABLE',
  apiRoute: (params) =>
    `/api/domains/${encodeURIComponent(params.domain)}/${encodeURIComponent(params.cluster)}/schedules/${encodeURIComponent(params.scheduleId)}`,
  httpMethod: 'DELETE',
  renderSuccessMessage: () => 'Schedule deleted.',
  onSuccess: ({ queryClient, params, router }) => {
    router.push(
      `/domains/${encodeURIComponent(params.domain)}/${encodeURIComponent(params.cluster)}/schedules`
    );
    queryClient.invalidateQueries({
      queryKey: [
        'listSchedules',
        { domain: params.domain, cluster: params.cluster },
      ],
    });
  },
};

const scheduleActionsConfig = [
  pauseScheduleActionConfig,
  resumeScheduleActionConfig,
  deleteScheduleActionConfig,
] as const;

/** Discriminated union of configured actions; use at menu/selection boundaries. */
export type SelectableScheduleAction = (typeof scheduleActionsConfig)[number];

export default scheduleActionsConfig;
