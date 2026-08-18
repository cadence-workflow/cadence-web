import { type z } from 'zod';

import { type CreateScheduleRequestBody } from '@/route-handlers/create-schedule/create-schedule.types';

import { type editScheduleFormSchema } from './schemas/edit-schedule-form-schema';

export type EditScheduleFormData = z.infer<typeof editScheduleFormSchema>;

/**
 * UpdateSchedule replaces the whole schedule definition, so the body matches
 * the create one. The schedule id is display-only in the edit form: the PUT URL
 * already carries it and the schedule id of an existing schedule cannot change.
 */
export type EditScheduleSubmissionData = Omit<
  CreateScheduleRequestBody,
  'scheduleId'
>;

/**
 * Prefill values for the edit form. `workerSDKLanguage` is explicitly unset
 * because Cadence does not persist it; the field is still required on submit.
 * `executionStartToCloseTimeoutSeconds` may be unset when describe has no timeout.
 */
export type EditScheduleFormPrefillValues = Omit<
  ExhaustiveDefaults<EditScheduleFormData>,
  'workerSDKLanguage' | 'executionStartToCloseTimeoutSeconds'
> & {
  workerSDKLanguage: undefined;
  executionStartToCloseTimeoutSeconds: number | undefined;
};

/**
 * Forces every key of T to be explicitly assigned, including optional fields,
 * whose value may still be `undefined`. Adding a field to T without updating a
 * literal typed as `ExhaustiveDefaults<T>` is a compile error, which is what
 * stops a newly-added form field from silently prefilling as blank.
 */
export type ExhaustiveDefaults<T> = { [K in keyof Required<T>]: T[K] };
