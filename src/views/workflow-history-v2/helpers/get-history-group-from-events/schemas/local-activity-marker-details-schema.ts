import { z } from 'zod';

/**
 * Local activity markers contain additional fields, but their storage varies by client:
 * - Go client: stores fields in the "details" Payload
 * - Java client: stores fields in headers (except result, which goes in "details" Payload)
 *
 * Field formats also differ (e.g., replay time is a date string in Go, epoch timestamp in Java).
 * This schema only includes the common fields that are consistently available.
 */
const localActivityMarkerDetailsSchema = z.object({
  activityId: z.string(),
  activityType: z.string(),
  attempt: z.number().optional(),
});

export default localActivityMarkerDetailsSchema;
