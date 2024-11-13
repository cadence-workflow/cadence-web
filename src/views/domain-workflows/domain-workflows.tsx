import React from 'react';

import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

import DomainWorkflowsFilters from './domain-workflows-filters/domain-workflows-filters';
import DomainWorkflowsTable from './domain-workflows-table/domain-workflows-table';

export default function DomainWorkflows(props: DomainPageTabContentProps) {
  return (
    <>
      <DomainWorkflowsFilters />
      <DomainWorkflowsTable domain={props.domain} cluster={props.cluster} />
    </>
  );
}
