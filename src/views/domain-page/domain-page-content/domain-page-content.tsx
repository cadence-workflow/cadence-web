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
  const TabContent = domainPageTabsConfig[decodedParams.domainTab].content;

  if (!TabContent) {
    return notFound();
  }

  return (
    <styled.PageSection>
      <TabContent
        domain={decodedParams.domain}
        cluster={decodedParams.cluster}
      />
    </styled.PageSection>
  );
}
