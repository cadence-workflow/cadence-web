'use client';
import React from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import request from '@/utils/request';

import DomainPageHeaderInfo from '../domain-page-header-info/domain-page-header-info';
import { type DomainInfo } from '../domain-page.types';

import { type Props } from './domain-page-header-info-loader.types';

export default function DomainPageHeaderInfoLoader(props: Props) {
  const { data: domainInfo } = useSuspenseQuery<DomainInfo>({
    queryKey: ['describeDomain', props],
    queryFn: () =>
      request(`/api/domains/${props.domain}/${props.cluster}`).then((res) =>
        res.json()
      ),
  });

  return (
    <DomainPageHeaderInfo
      loading={false}
      domainInfo={domainInfo}
      cluster={props.cluster}
    />
  );
}
