import { Button } from 'baseui/button';
import { Filter } from 'baseui/icon';
import { MdReplay } from 'react-icons/md';

import { type WorkflowHistoryFilterConfig } from '@/views/workflow-history/workflow-history.types';

import workflowHistoryFiltersConfig from '../config/workflow-history-filters.config';

import { styled } from './workflow-history-filters-menu.styles';
import { type Props } from './workflow-history-filters-menu.types';

export default function WorkflowHistoryFiltersMenu({
  queryParams,
  setQueryParams,
  activeFiltersCount,
  resetAllFilters,
}: Props) {
  return (
    <styled.MenuContainer>
      <styled.MenuHeader>
        <styled.FiltersCount>
          <Filter size={16} />
          {`Filters (${activeFiltersCount})`}
        </styled.FiltersCount>
        <Button
          onClick={resetAllFilters}
          size="compact"
          kind="tertiary"
          startEnhancer={<MdReplay />}
        >
          Reset
        </Button>
      </styled.MenuHeader>
      <styled.MenuFilters>
        {workflowHistoryFiltersConfig.map(
          (filter: WorkflowHistoryFilterConfig<any>) => (
            <filter.component
              key={filter.id}
              value={filter.getValue(queryParams)}
              setValue={(newValue) =>
                setQueryParams(filter.formatValue(newValue))
              }
            />
          )
        )}
      </styled.MenuFilters>
    </styled.MenuContainer>
  );
}
