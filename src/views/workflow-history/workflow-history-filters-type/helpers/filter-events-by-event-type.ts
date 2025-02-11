import { type ExtendedHistoryEvent } from '../../workflow-history.types';
import { WORKFLOW_HISTORY_EVENT_FILTERING_TYPE_TO_ATTRS_MAP } from '../workflow-history-filters-type.constants';
import { type WorkflowHistoryFiltersTypeValue } from '../workflow-history-filters-type.types';

const filterEventsByEventType = function (
  event: ExtendedHistoryEvent,
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
