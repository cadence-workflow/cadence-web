import {
  MdHistory,
  MdOutlineWarningAmber,
  MdPauseCircleOutline,
  MdPlayCircleOutline,
} from 'react-icons/md';

import { type BackfillScheduleResponse } from '@/route-handlers/backfill-schedule/backfill-schedule.types';
import { type PauseScheduleResponse } from '@/route-handlers/pause-schedule/pause-schedule.types';
import { type UnpauseScheduleResponse } from '@/route-handlers/unpause-schedule/unpause-schedule.types';

import transformBackfillScheduleFormToSubmission from '../schedule-action-backfill-form/helpers/transform-backfill-schedule-form-to-submission';
import ScheduleActionBackfillForm from '../schedule-action-backfill-form/schedule-action-backfill-form';
import { DEFAULT_BACKFILL_OVERLAP_POLICY } from '../schedule-action-backfill-form/schedule-action-backfill-form.constants';
import { type BackfillScheduleFormData } from '../schedule-action-backfill-form/schedule-action-backfill-form.types';
import { backfillScheduleFormSchema } from '../schedule-action-backfill-form/schemas/backfill-schedule-form-schema';
import {
  type BackfillScheduleSubmissionData,
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

const backfillScheduleActionConfig: ScheduleAction<
  BackfillScheduleResponse,
  BackfillScheduleFormData,
  BackfillScheduleSubmissionData
> = {
  id: 'backfill',
  label: 'Backfill',
  subtitle: 'Backfill missed workflow runs',
  modal: {
    withForm: true,
    form: ScheduleActionBackfillForm,
    formSchema: backfillScheduleFormSchema,
    transformFormDataToSubmission: transformBackfillScheduleFormToSubmission,
    initialFormValues: {
      overlapPolicy: DEFAULT_BACKFILL_OVERLAP_POLICY,
    },
  },
  icon: MdHistory,
  getRunnableStatus: () => 'RUNNABLE',
  apiRoute: (params) =>
    `/api/domains/${encodeURIComponent(params.domain)}/${encodeURIComponent(params.cluster)}/schedules/${encodeURIComponent(params.scheduleId)}/backfill`,
  renderSuccessMessage: () => 'Schedule backfill has been started.',
};

const scheduleActionsConfig = [
  pauseScheduleActionConfig,
  resumeScheduleActionConfig,
  backfillScheduleActionConfig,
] as const;

/** Discriminated union of configured actions; use at menu/selection boundaries. */
export type SelectableScheduleAction = (typeof scheduleActionsConfig)[number];

export default scheduleActionsConfig;
