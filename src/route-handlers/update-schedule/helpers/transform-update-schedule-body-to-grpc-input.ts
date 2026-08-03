import { type UpdateScheduleRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/UpdateScheduleRequest';

import transformCreateScheduleBodyToGrpcInput from '../../create-schedule/helpers/transform-create-schedule-body-to-grpc-input';
import { type UpdateScheduleRequestBody } from '../update-schedule.types';

export default function transformUpdateScheduleBodyToGrpcInput({
  domain,
  scheduleId,
  body,
}: {
  domain: string;
  scheduleId: string;
  body: UpdateScheduleRequestBody;
}): UpdateScheduleRequest__Input {
  // UpdateSchedule replaces the whole schedule definition, so spec/action/policies
  // are built exactly as they are for CreateSchedule.
  const { spec, action, policies } = transformCreateScheduleBodyToGrpcInput({
    domain,
    body: { ...body, scheduleId },
  });

  return { domain, scheduleId, spec, action, policies };
}
