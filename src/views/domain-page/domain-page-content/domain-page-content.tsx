'use client';
import React from 'react';

import { notFound } from 'next/navigation';

import decodeUrlParams from '@/utils/decode-url-params';

import domainPageTabsConfig from '../config/domain-page-tabs.config';

import { styled } from './domain-page-content.styles';
import {
  type DomainPageContentParams,
  type Props,
} from './domain-page-content.types';

export default function DomainPageContent(props: Props) {
  const decodedParams = decodeUrlParams(
    props.params
  ) as DomainPageContentParams;
  const tabConfig = domainPageTabsConfig[decodedParams.domainTab];

  if (!tabConfig) {
    return notFound();
  }

  return (
    <styled.PageSection>
      <tabConfig.content
        domain={decodedParams.domain}
        cluster={decodedParams.cluster}
      />
    </styled.PageSection>
  );
}
