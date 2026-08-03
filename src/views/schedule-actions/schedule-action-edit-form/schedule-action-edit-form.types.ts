import { type z } from 'zod';

import { type editScheduleFormSchema } from './schemas/edit-schedule-form-schema';

export type EditScheduleFormData = z.infer<typeof editScheduleFormSchema>;

/**
 * Forces every key of T to be explicitly assigned, including optional fields,
 * whose value may still be `undefined`. Adding a field to T without updating a
 * literal typed as `ExhaustiveDefaults<T>` is a compile error, which is what
 * stops a newly-added form field from silently prefilling as blank.
 *
 * The keys come from `Required<T>` rather than from `[K in keyof T]-?` because
 * the `-?` modifier would also strip `undefined` out of the value type, which
 * would make genuinely optional fields impossible to leave unset.
 */
export type ExhaustiveDefaults<T> = { [K in keyof Required<T>]: T[K] };
