'use client';
import PageFilters from '@/components/page-filters/page-filters';
import PageSection from '@/components/page-section/page-section';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';

import domainWorkflowsFiltersConfig from '../config/domain-workflows-filters.config';

import { styled } from './domain-workflows-filters.styles';

export default function DomainWorkflowsFilters() {
  return (
    <PageSection>
      <styled.FiltersContainer>
        <PageFilters
          searchQueryParamKey="search"
          searchPlaceholder="Search for Workflow ID, Run ID, or Workflow Type"
          pageFiltersConfig={domainWorkflowsFiltersConfig}
          pageQueryParamsConfig={domainPageQueryParamsConfig}
        />
      </styled.FiltersContainer>
    </PageSection>
  );
}
