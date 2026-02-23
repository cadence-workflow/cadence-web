import formatPayload from '@/utils/data-formatters/format-payload';
import logger from '@/utils/logger';

import WORKFLOW_HISTORY_SHOULD_SHORTEN_GROUP_LABELS_CONFIG from '../../config/workflow-history-should-shorten-group-labels.config';
import type {
  LocalActivityHistoryEvent,
  LocalActivityHistoryGroup,
} from '../../workflow-history-v2.types';
import getCommonHistoryGroupFields from '../get-common-history-group-fields';

import localActivityMarkerDetailsSchema from './schemas/local-activity-marker-details-schema';

export default function getLocalActivityGroupFromEvents(
  events: LocalActivityHistoryEvent[]
): LocalActivityHistoryGroup {
  const event = events[0];
  const markerAttr = 'markerRecordedEventAttributes';
  const groupType = 'LocalActivity';
  const hasMissingEvents = false;

  let activityId: string | undefined,
    activityType: string | undefined,
    label = 'Local Activity',
    shortLabel: string | undefined;

  const formattedLocalActivityPayload = formatPayload(
    event[markerAttr]?.details
  );

  const { data: localActivityDetails, error } =
    localActivityMarkerDetailsSchema.safeParse(formattedLocalActivityPayload);

  if (error) {
    logger.warn(
      { error, formattedDetails: formattedLocalActivityPayload },
      'Error parsing local activity details'
    );
  } else {
    activityId = localActivityDetails.activityId;
    activityType = localActivityDetails.activityType;

    label = `Local Activity ${activityId}: ${activityType}`;

    if (
      WORKFLOW_HISTORY_SHOULD_SHORTEN_GROUP_LABELS_CONFIG &&
      activityType.includes('.')
    ) {
      shortLabel = `Local Activity ${activityId}: ${activityType.split(/[./]/g).pop()}`;
    }
  }

  return {
    label,
    shortLabel,
    hasMissingEvents,
    groupType,
    ...getCommonHistoryGroupFields<LocalActivityHistoryGroup>({
      events,
      historyGroupEventToStatusMap: {
        markerRecordedEventAttributes: 'COMPLETED',
      },
      eventToLabelMap: {
        markerRecordedEventAttributes: 'Completed',
      },
      eventToTimeLabelPrefixMap: {},
      closeEvent: undefined,
      eventToAdditionalDetailsMap: {
        markerRecordedEventAttributes: {
          localActivityId: activityId,
          localActivityType: activityType,
        },
      },
    }),
  };
}
