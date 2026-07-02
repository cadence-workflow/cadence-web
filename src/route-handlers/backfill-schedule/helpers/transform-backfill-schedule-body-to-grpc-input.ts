import { type BackfillScheduleRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/BackfillScheduleRequest';
import getGrpcTimestampFromIso from '@/utils/datetime/get-grpc-timestamp-from-iso';

import { type BackfillScheduleRequestBody } from '../backfill-schedule.types';

export default function transformBackfillScheduleBodyToGrpcInput({
  domain,
  scheduleId,
  body,
}: {
  domain: string;
  scheduleId: string;
  body: BackfillScheduleRequestBody;
}): BackfillScheduleRequest__Input {
  return {
    domain,
    scheduleId,
    startTime: getGrpcTimestampFromIso(body.startTime),
    endTime: getGrpcTimestampFromIso(body.endTime),
    overlapPolicy: body.overlapPolicy,
    backfillId: body.backfillId,
  };
}
