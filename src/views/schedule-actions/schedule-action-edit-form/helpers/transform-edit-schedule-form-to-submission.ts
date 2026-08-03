import { type CreateScheduleRequestBody } from '@/route-handlers/create-schedule/create-schedule.types';
import transformDomainSchedulesCreateFormToBody from '@/views/domain-schedules/domain-schedules-create-modal/helpers/transform-domain-schedules-create-form-to-body';

import { type EditScheduleFormData } from '../schedule-action-edit-form.types';

export type EditScheduleSubmissionData = Omit<
  CreateScheduleRequestBody,
  'scheduleId'
>;

/**
 * UpdateSchedule replaces the whole schedule definition, so the body matches
 * the create one. The schedule id is display-only in the edit form: the PUT URL
 * already carries it and the schedule id of an existing schedule cannot change.
 */
export default function transformEditScheduleFormToSubmission(
  formData: EditScheduleFormData
): EditScheduleSubmissionData {
  const { scheduleId: _scheduleId, ...body } =
    transformDomainSchedulesCreateFormToBody(formData);

  return body;
}
