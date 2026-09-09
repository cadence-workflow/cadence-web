import { type _uber_cadence_api_v1_ScheduleAction_StartWorkflowAction as StartWorkflowAction } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleAction';
import formatPayloadMap from '@/utils/data-formatters/format-payload-map';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

export default function mapMemoToFormDefault(
  memo: StartWorkflowAction['memo'] | undefined
): string | undefined {
  const decoded = formatPayloadMap(memo ?? null, 'fields')?.fields as
    | Record<string, unknown>
    | undefined;

  return decoded && Object.keys(decoded).length > 0
    ? losslessJsonStringify(decoded, null, 2)
    : undefined;
}
