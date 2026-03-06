import workflowHistoryEventGroupTypeToCategoryConfig from '../config/workflow-history-event-group-category-map.config';
import { type EventGroupTypeToCategoryConfig } from '../workflow-history-filters-menu/workflow-history-filters-menu.types';
import { type HistoryEventsGroup } from '../workflow-history-v2.types';

export default function getEventGroupCategory(group: HistoryEventsGroup) {
  const categoryConfig = workflowHistoryEventGroupTypeToCategoryConfig[
    group.groupType
  ] as EventGroupTypeToCategoryConfig;

  return typeof categoryConfig === 'function'
    ? categoryConfig(group)
    : categoryConfig;
}
