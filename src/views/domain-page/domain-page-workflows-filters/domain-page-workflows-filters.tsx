'use client';
import PageFilters from '@/components/page-filters/page-filters';
import PageSection from '@/components/page-section/page-section';

import domainPageQueryParamsConfig from '../config/domain-page-query-params.config';
import domainPageWorkflowsFiltersConfig from '../config/domain-page-workflows-filters.config';

import { styled } from './domain-page-workflows-filters.styles';

export default function DomainPageWorkflowsFilters() {
  return (
    <PageSection>
      <styled.FiltersContainer>
        <PageFilters
          searchQueryParamKey="search"
          searchPlaceholder="Find workflow"
          pageFiltersConfig={domainPageWorkflowsFiltersConfig}
          pageQueryParamsConfig={domainPageQueryParamsConfig}
        />
      </styled.FiltersContainer>
    </PageSection>
  );
}
