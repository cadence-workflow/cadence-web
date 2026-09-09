import transformDomainSchedulesCreateFormToBody from '@/views/domain-schedules/domain-schedules-create-modal/helpers/transform-domain-schedules-create-form-to-body';

import {
  type EditScheduleFormData,
  type EditScheduleSubmissionData,
} from '../schedule-action-edit-form.types';

export default function transformEditScheduleFormToSubmission(
  formData: EditScheduleFormData
): EditScheduleSubmissionData {
  const { scheduleId: _scheduleId, ...body } =
    transformDomainSchedulesCreateFormToBody(formData);

  return body;
}
