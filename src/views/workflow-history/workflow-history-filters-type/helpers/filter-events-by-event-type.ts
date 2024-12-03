import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import { WORKFLOW_HISTORY_EVENT_FILTERING_TYPE_TO_ATTRS_MAP } from '../workflow-history-filters-type.constants';
import { type WorkflowHistoryFiltersTypeValue } from '../workflow-history-filters-type.types';

const filterEventsByEventType = function (
  event: HistoryEvent,
  value: WorkflowHistoryFiltersTypeValue
) {
  const attr = event.attributes;
  if (value.historyEventTypes === undefined) return true;

  const selectedAttributes = value.historyEventTypes.flatMap(
    (type) => WORKFLOW_HISTORY_EVENT_FILTERING_TYPE_TO_ATTRS_MAP[type]
  );
  if (selectedAttributes.includes(attr)) return true;
  return false;
};

export default filterEventsByEventType;
