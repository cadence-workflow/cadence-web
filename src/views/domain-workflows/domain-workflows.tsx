import React from 'react';

import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

import DomainWorkflowsHeader from './domain-workflows-header/domain-workflows-header';
import DomainWorkflowsTable from './domain-workflows-table/domain-workflows-table';

export default function DomainWorkflows(props: DomainPageTabContentProps) {
  return (
    <>
      <DomainWorkflowsHeader />
      <DomainWorkflowsTable domain={props.domain} cluster={props.cluster} />
    </>
  );
}
