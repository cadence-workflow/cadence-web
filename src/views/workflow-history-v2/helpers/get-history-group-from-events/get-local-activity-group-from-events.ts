import logger from '@/utils/logger';

import WORKFLOW_HISTORY_SHOULD_SHORTEN_GROUP_LABELS_CONFIG from '../../config/workflow-history-should-shorten-group-labels.config';
import type {
  HistoryGroupEventToAdditionalDetailsMap,
  HistoryGroupEventToStatusMap,
  HistoryGroupEventToStringMap,
  HistoryGroupEventToSummaryFieldsMap,
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
    resultJson: object | undefined,
    label = 'Local Activity',
    shortLabel: string | undefined;

  // What else can a local activity marker have?
  const { data: localActivityDetails, error } =
    localActivityMarkerDetailsSchema.safeParse(event[markerAttr]?.details);

  if (error) {
    logger.warn(
      { error, rawDetails: event[markerAttr]?.details },
      'Error parsing local activity details'
    );
  } else {
    activityId = localActivityDetails.activityId;
    activityType = localActivityDetails.activityType;
    resultJson = localActivityDetails.resultJson;

    label = `Local Activity ${activityId}: ${activityType}`;

    if (
      WORKFLOW_HISTORY_SHOULD_SHORTEN_GROUP_LABELS_CONFIG &&
      activityType.includes('.')
    ) {
      shortLabel = `Local Activity ${activityId}: ${activityType.split(/[./]/g).pop()}`;
    }
  }

  const eventToLabel: HistoryGroupEventToStringMap<LocalActivityHistoryGroup> =
    {
      markerRecordedEventAttributes: 'Completed',
    };

  const eventToStatus: HistoryGroupEventToStatusMap<LocalActivityHistoryGroup> =
    {
      markerRecordedEventAttributes: 'COMPLETED',
    };

  const eventToAdditionalDetails: HistoryGroupEventToAdditionalDetailsMap<LocalActivityHistoryGroup> =
    {
      markerRecordedEventAttributes: {
        localActivityId: activityId,
        localActivityType: activityType,
        result: resultJson,
      },
    };

  const eventToSummaryFields: HistoryGroupEventToSummaryFieldsMap<LocalActivityHistoryGroup> =
    {
      markerRecordedEventAttributes: ['result'],
    };

  return {
    label,
    shortLabel,
    hasMissingEvents,
    groupType,
    ...getCommonHistoryGroupFields<LocalActivityHistoryGroup>({
      events,
      historyGroupEventToStatusMap: eventToStatus,
      eventToLabelMap: eventToLabel,
      eventToTimeLabelPrefixMap: {},
      closeEvent: undefined,
      eventToAdditionalDetailsMap: eventToAdditionalDetails,
      eventToSummaryFieldsMap: eventToSummaryFields,
    }),
  };
}
