import {
  MdOutlineWarningAmber,
  MdPauseCircleOutline,
  MdPlayCircleOutline,
} from 'react-icons/md';

import { type PauseScheduleResponse } from '@/route-handlers/pause-schedule/pause-schedule.types';
import { type UnpauseScheduleResponse } from '@/route-handlers/unpause-schedule/unpause-schedule.types';

import transformResumeScheduleFormToSubmission from '../schedule-action-resume-form/helpers/transform-resume-schedule-form-to-submission';
import ScheduleActionResumeForm from '../schedule-action-resume-form/schedule-action-resume-form';
import { USE_SCHEDULE_CATCH_UP_POLICY } from '../schedule-action-resume-form/schedule-action-resume-form.constants';
import {
  type ResumeScheduleFormData,
  type ResumeScheduleSubmissionData,
} from '../schedule-action-resume-form/schedule-action-resume-form.types';
import { resumeScheduleFormSchema } from '../schedule-action-resume-form/schemas/resume-schedule-form-schema';
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

const resumeScheduleActionConfig: ScheduleAction<
  UnpauseScheduleResponse,
  ResumeScheduleFormData,
  ResumeScheduleSubmissionData
> = {
  id: 'resume',
  label: 'Resume',
  subtitle: 'Resume a paused schedule',
  modal: {
    withForm: true,
    form: ScheduleActionResumeForm,
    formSchema: resumeScheduleFormSchema,
    transformFormDataToSubmission: transformResumeScheduleFormToSubmission,
    initialFormValues: {
      catchUpPolicy: USE_SCHEDULE_CATCH_UP_POLICY,
      reason: '',
    },
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
] as const;

/** Discriminated union of configured actions; use at menu/selection boundaries. */
export type SelectableScheduleAction = (typeof scheduleActionsConfig)[number];

export default scheduleActionsConfig;
