import React from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import request from '@/utils/request';
import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

import { type DomainInfo } from '../domain-page/domain-page.types';

import DomainWorkflowsArchivalHeader from './domain-workflows-archival-header/domain-workflows-archival-header';

export default function DomainWorkflowsArchival(
  props: DomainPageTabContentProps
) {
  const {
    data: { historyArchivalStatus, visibilityArchivalStatus },
  } = useSuspenseQuery<DomainInfo>({
    queryKey: ['describeDomain', props],
    queryFn: () =>
      request(`/api/domains/${props.domain}/${props.cluster}`).then((res) =>
        res.json()
      ),
  });

  if (
    historyArchivalStatus !== 'ARCHIVAL_STATUS_ENABLED' ||
    visibilityArchivalStatus !== 'ARCHIVAL_STATUS_ENABLED'
  ) {
    // TODO: archival landing page
    return <div>Archival disabled</div>;
  }

  return (
    <>
      <DomainWorkflowsArchivalHeader
        domain={props.domain}
        cluster={props.cluster}
      />
      {/* TODO: archival table
      <DomainWorkflowsArchivalTable
        domain={props.domain}
        cluster={props.cluster}
      />
      */}
    </>
  );
}
