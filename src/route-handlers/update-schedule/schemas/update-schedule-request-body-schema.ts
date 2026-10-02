import {
  refineScheduleBodyPeriod,
  scheduleBodyFieldsSchema,
} from '../../create-schedule/schemas/create-schedule-request-body-schema';

const updateScheduleRequestBodySchema = scheduleBodyFieldsSchema.superRefine(
  refineScheduleBodyPeriod
);

export default updateScheduleRequestBodySchema;
