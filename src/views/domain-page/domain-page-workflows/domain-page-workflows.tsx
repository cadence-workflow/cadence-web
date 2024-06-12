import React from 'react';

import { type DomainPageTabContentProps } from '../domain-page-content/domain-page-content.types';
import DomainPageWorkflowsFilters from '../domain-page-workflows-filters/domain-page-workflows-filters';

export default function DomainPageWorkflows(props: DomainPageTabContentProps) {
  return (
    <>
      <DomainPageWorkflowsFilters />
    </>
  );
}
