import { Button } from 'baseui/button';
import { Filter } from 'baseui/icon';
import { MdReplay } from 'react-icons/md';

import useWorkflowHistoryFiltersConfig from '../hooks/use-workflow-history-filters-config';
import { type WorkflowHistoryFilterConfig } from '../workflow-history.types';

import { styled } from './workflow-history-filters-menu.styles';
import { type Props } from './workflow-history-filters-menu.types';

export default function WorkflowHistoryFiltersMenu({
  queryParams,
  setQueryParams,
  activeFiltersCount,
  resetAllFilters,
}: Props) {
  const workflowHistoryFiltersConfig = useWorkflowHistoryFiltersConfig();

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
            <styled.MenuFilterContainer key={filter.id}>
              <filter.component
                value={filter.getValue(queryParams)}
                setValue={(newValue) =>
                  setQueryParams(filter.formatValue(newValue))
                }
              />
            </styled.MenuFilterContainer>
          )
        )}
      </styled.MenuFilters>
    </styled.MenuContainer>
  );
}
