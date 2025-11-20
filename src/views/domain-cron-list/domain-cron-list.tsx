import React from 'react';

import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

import CronListTable from './cron-list-table/cron-list-table';
import { styled } from './domain-cron-list.styles';

export default function DomainCronList({
  domain,
  cluster,
}: DomainPageTabContentProps) {
  return (
    <styled.DomainCronListContainer>
      <CronListTable domain={domain} cluster={cluster} />
    </styled.DomainCronListContainer>
  );
}
