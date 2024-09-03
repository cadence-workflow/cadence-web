'use client';
import PageFilters from '@/components/page-filters/page-filters';
import PageSection from '@/components/page-section/page-section';

import domainWorkflowsFiltersConfig from '../config/domain-workflows-filters.config';
import domainWorkflowsQueryParamsConfig from '../config/domain-workflows-query-params.config';

import { styled } from './domain-workflows-filters.styles';

export default function DomainWorkflowsFilters() {
  return (
    <PageSection>
      <styled.FiltersContainer>
        <PageFilters
          searchQueryParamKey="search"
          searchPlaceholder="Find workflow"
          pageFiltersConfig={domainWorkflowsFiltersConfig}
          pageQueryParamsConfig={domainWorkflowsQueryParamsConfig}
        />
      </styled.FiltersContainer>
    </PageSection>
  );
}
