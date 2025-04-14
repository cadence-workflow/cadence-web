import React from 'react';

import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

import useSuspenseDomainDescription from '../shared/hooks/use-suspense-domain-description';

import DomainWorkflowsArchivalDisabledPanel from './domain-workflows-archival-disabled-panel/domain-workflows-archival-disabled-panel';
import DomainWorkflowsArchivalHeader from './domain-workflows-archival-header/domain-workflows-archival-header';
import DomainWorkflowsArchivalTable from './domain-workflows-archival-table/domain-workflows-archival-table';

export default function DomainWorkflowsArchival(
  props: DomainPageTabContentProps
) {
  const {
    data: { historyArchivalStatus, visibilityArchivalStatus },
  } = useSuspenseDomainDescription(props);

  if (
    historyArchivalStatus !== 'ARCHIVAL_STATUS_ENABLED' ||
    visibilityArchivalStatus !== 'ARCHIVAL_STATUS_ENABLED'
  ) {
    return <DomainWorkflowsArchivalDisabledPanel />;
  }

  return (
    <>
      <DomainWorkflowsArchivalHeader
        domain={props.domain}
        cluster={props.cluster}
      />
      <DomainWorkflowsArchivalTable
        domain={props.domain}
        cluster={props.cluster}
      />
    </>
  );
}
