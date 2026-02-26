import { z } from 'zod';

import formatPayload from '@/utils/data-formatters/format-payload';

/**
 * Schema to parse local activity metadata from MarkerRecordedEvent attributes.
 *
 * Local activity data is stored differently depending on the client SDK:
 *
 * **Go client:**
 * - Metadata (activityId, activityType, attempt, errReason) is in `details`
 * - Result is in `details.resultJson` (on success) or `details.errJson` (on failure)
 *
 * **Java client:**
 * - Metadata is in `header.fields['LocalActivityHeader']`
 * - Both success and failure results are in `details`
 *
 * Due to these differences, result/error fields are intentionally not parsed here.
 * Additionally, despite the "Json" suffix, these fields are not guaranteed to be JSON.
 * Results are rendered separately from the raw event attributes.
 *
 * Other fields (e.g., `replayTime` in Go, `replayTimeMillis` in Java) are also ignored
 * because their formats differ between clients. This schema only extracts common fields.
 *
 * {@link https://github.com/cadence-workflow/cadence-go-client/blob/90b1bb7bb64246c16b02790ed05aa24a9474a542/internal/internal_event_handlers.go#L1168 | Go client reference}
 *
 * {@link https://github.com/cadence-workflow/cadence-java-client/blob/57efcc2a82be89ddeeb33ea6e3a1e2019e2a5d09/src/main/java/com/uber/cadence/internal/common/LocalActivityMarkerData.java#L34 | Java client reference}
 */
const localActivityDetailsSchema = z
  .object({
    data: z.string(),
  })
  .transform((payload) => formatPayload(payload))
  .pipe(
    z.object({
      activityId: z.string(),
      activityType: z.string(),
      attempt: z.number().optional(),
      errReason: z.string().nullable().catch(null),
    })
  );

export default localActivityDetailsSchema;
