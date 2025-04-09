'use client';
import React from 'react';

import useSuspenseDomainDescription from '@/views/shared/hooks/use-suspense-domain-description';

import DomainPageHeaderInfo from '../domain-page-header-info/domain-page-header-info';

import { type Props } from './domain-page-header-info-loader.types';

export default function DomainPageHeaderInfoLoader(props: Props) {
  const { data: domainDescription } = useSuspenseDomainDescription(props);

  return (
    <DomainPageHeaderInfo
      loading={false}
      domainDescription={domainDescription}
      cluster={props.cluster}
    />
  );
}
