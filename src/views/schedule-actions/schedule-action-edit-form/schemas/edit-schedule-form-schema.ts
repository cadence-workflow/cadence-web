import refineCreateScheduleForm from '@/views/domain-schedules/domain-schedules-create-modal/helpers/refine-create-schedule-form';
import { createScheduleFormFieldsSchema } from '@/views/domain-schedules/domain-schedules-create-modal/schemas/create-schedule-form-schema';

/**
 * Editing validates exactly like creating. Keeping the field shapes identical
 * is what lets the edit form reuse the create form components as they are, so
 * this deliberately re-composes the create pieces rather than adding rules of
 * its own. It exists as a separate schema so edit-only rules have a home.
 */
export const editScheduleFormSchema =
  createScheduleFormFieldsSchema.superRefine(refineCreateScheduleForm);
