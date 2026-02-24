import logger from '@/utils/logger';

import WORKFLOW_HISTORY_SHOULD_SHORTEN_GROUP_LABELS_CONFIG from '../../config/workflow-history-should-shorten-group-labels.config';
import type {
  LocalActivityHistoryEvent,
  LocalActivityHistoryGroup,
} from '../../workflow-history-v2.types';
import getCommonHistoryGroupFields from '../get-common-history-group-fields';

import localActivityDetailsSchema from './schemas/local-activity-details-schema';

export default function getLocalActivityGroupFromEvents(
  events: LocalActivityHistoryEvent[]
): LocalActivityHistoryGroup {
  const event = events[0];
  const markerAttr = 'markerRecordedEventAttributes';
  const groupType = 'LocalActivity';
  const hasMissingEvents = false;

  let localActivityId: string | undefined,
    localActivityType: string | undefined,
    attempt: number | undefined,
    reason: string | undefined,
    label = 'Local Activity',
    shortLabel: string | undefined;

  // Local activity data is stored differently depending on the client SDK:
  // - Go client: Metadata is in `details`, result is in `details.resultJson` or `details.errJson`
  // - Java client: Metadata is in `header.fields['LocalActivityHeader']`, result is in `details`
  const headersPayload =
    event[markerAttr]?.header?.fields['LocalActivityHeader'];
  const detailsPayload = event[markerAttr]?.details;

  const { data: localActivityDetails, error: parseError } =
    localActivityDetailsSchema.safeParse(headersPayload ?? detailsPayload);

  if (!localActivityDetails) {
    logger.warn(
      { error: parseError, attributes: event[markerAttr] },
      'Error parsing local activity details'
    );
  } else {
    localActivityId = localActivityDetails.activityId;
    localActivityType = localActivityDetails.activityType;
    attempt = localActivityDetails.attempt;
    reason = localActivityDetails.errReason ?? undefined;

    label = `Local Activity ${localActivityId}: ${localActivityType}`;

    if (
      WORKFLOW_HISTORY_SHOULD_SHORTEN_GROUP_LABELS_CONFIG &&
      localActivityType.includes('.')
    ) {
      shortLabel = `Local Activity ${localActivityId}: ${localActivityType.split(/[./]/g).pop()}`;
    }
  }

  const isLocalActivityFailed = Boolean(reason);

  return {
    label,
    shortLabel,
    hasMissingEvents,
    groupType,
    ...getCommonHistoryGroupFields<LocalActivityHistoryGroup>({
      events,
      historyGroupEventToStatusMap: {
        markerRecordedEventAttributes: isLocalActivityFailed
          ? 'FAILED'
          : 'COMPLETED',
      },
      eventToLabelMap: {
        markerRecordedEventAttributes: isLocalActivityFailed
          ? 'Failed'
          : 'Completed',
      },
      eventToTimeLabelPrefixMap: {},
      closeEvent: undefined,
      eventToAdditionalDetailsMap: {
        markerRecordedEventAttributes: {
          localActivityId,
          localActivityType,
          attempt,
          reason,
        },
      },
      eventToSummaryFieldsMap: {
        markerRecordedEventAttributes: ['attempt', 'reason'],
      },
      eventToNegativeFieldsMap: {
        markerRecordedEventAttributes: [
          'reason',
          ...(isLocalActivityFailed ? ['details'] : []),
        ],
      },
    }),
  };
}
