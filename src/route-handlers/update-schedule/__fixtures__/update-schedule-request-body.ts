import { mockCreateScheduleRequestBody } from '../../create-schedule/__fixtures__/create-schedule-request-body';
import { type UpdateScheduleRequestBody } from '../update-schedule.types';

const { scheduleId: _scheduleId, ...mockUpdateScheduleRequestBodyFields } =
  mockCreateScheduleRequestBody;

export const mockUpdateScheduleRequestBody: UpdateScheduleRequestBody =
  mockUpdateScheduleRequestBodyFields;
