import useLocalStorageValue from '@/hooks/use-local-storage-value';

import { type WorkflowHistoryEventFilteringType } from '../workflow-history-filters-type/workflow-history-filters-type.types';

export default function useHistoryEventTypesPreference() {
  return useLocalStorageValue<Array<WorkflowHistoryEventFilteringType>>({
    key: 'history-event-types',
    encode: JSON.stringify,
    decode: JSON.parse,
  });
}
