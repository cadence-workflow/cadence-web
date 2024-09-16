'use client';
import PageFilters from '@/components/page-filters/page-filters';

import taskListFiltersConfig from '../config/task-list-filters.config';
import taskListPageQueryParamsConfig from '../config/task-list-page-query-params.config';

import { styled } from './task-list-filters.styles';

export default function TaskListFilters() {
  return (
    <styled.FiltersContainer>
      <PageFilters
        searchQueryParamKey="taskListSearch"
        searchPlaceholder="Find worker by identity"
        pageFiltersConfig={taskListFiltersConfig}
        pageQueryParamsConfig={taskListPageQueryParamsConfig}
      />
    </styled.FiltersContainer>
  );
}
