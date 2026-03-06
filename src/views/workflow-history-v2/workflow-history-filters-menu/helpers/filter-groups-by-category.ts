import getEventGroupCategory from '../../helpers/get-event-group-category';
import { type HistoryEventsGroup } from '../../workflow-history-v2.types';
import { type EventGroupCategoryFilterValue } from '../workflow-history-filters-menu.types';

const filterGroupsByCategory = (
  group: HistoryEventsGroup,
  { historyEventTypes }: EventGroupCategoryFilterValue
) =>
  historyEventTypes
    ? historyEventTypes.includes(getEventGroupCategory(group))
    : true;

export default filterGroupsByCategory;
