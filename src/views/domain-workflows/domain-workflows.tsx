import React, { Suspense } from 'react';

import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

import DomainWorkflowsFilters from './domain-workflows-filters/domain-workflows-filters';
import DomainWorkflowsTable from './domain-workflows-table/domain-workflows-table';

export default function DomainWorkflows(props: DomainPageTabContentProps) {
  return (
    <>
      <DomainWorkflowsFilters />
      <Suspense fallback={<SectionLoadingIndicator />}>
        <DomainWorkflowsTable domain={props.domain} cluster={props.cluster} />
      </Suspense>
    </>
  );
}
