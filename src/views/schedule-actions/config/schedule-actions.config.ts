import {
  MdDeleteOutline,
  MdOutlineWarningAmber,
  MdPauseCircleOutline,
  MdPlayCircleOutline,
} from 'react-icons/md';

import { type DeleteScheduleResponse } from '@/route-handlers/delete-schedule/delete-schedule.types';
import { type PauseScheduleResponse } from '@/route-handlers/pause-schedule/pause-schedule.types';
import { type UnpauseScheduleResponse } from '@/route-handlers/unpause-schedule/unpause-schedule.types';

import ScheduleActionPauseForm from '../schedule-action-pause-form/schedule-action-pause-form';
import { type PauseScheduleFormData } from '../schedule-action-pause-form/schedule-action-pause-form.types';
import { pauseScheduleFormSchema } from '../schedule-action-pause-form/schemas/pause-schedule-form-schema';
import transformResumeScheduleFormToSubmission from '../schedule-action-resume-form/helpers/transform-resume-schedule-form-to-submission';
import ScheduleActionResumeForm from '../schedule-action-resume-form/schedule-action-resume-form';
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
  PauseScheduleFormData,
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
    withForm: true,
    form: ScheduleActionPauseForm,
    formSchema: pauseScheduleFormSchema,
    transformFormDataToSubmission: (formData) => formData,
  },
  icon: MdPauseCircleOutline,
  getRunnableStatus: (schedule) =>
    schedule.state?.paused
      ? 'NOT_RUNNABLE_SCHEDULE_ALREADY_PAUSED'
      : 'RUNNABLE',
  apiRoute: (params) =>
    `/api/domains/${encodeURIComponent(params.domain)}/${encodeURIComponent(params.cluster)}/schedules/${encodeURIComponent(params.scheduleId)}/pause`,
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
    text: 'Deletes the schedule permanently. In-progress workflow runs are not affected.',
    docsLink: {
      text: 'Read more about schedules',
      href: 'https://cadenceworkflow.io/docs/concepts/schedules',
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
