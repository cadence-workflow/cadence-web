'use client';
import React, { Suspense } from 'react';

import Image from 'next/image';

import cadenceLogoBlack from '@/assets/cadence-logo-black.svg';
import PageSection from '@/components/page-section/page-section';

import DomainPageHeaderInfo from '../domain-page-header-info/domain-page-header-info';
import DomainPageHeaderInfoLoader from '../domain-page-header-info-loader/domain-page-header-info-loader';
import DomainPageHeaderStatusTag from '../domain-page-header-status-tag/domain-page-header-status-tag';

import { styled } from './domain-page-header.styles';
import { type Props } from './domain-page-header.types';

export default function DomainPageHeader(props: Props) {
  return (
    <PageSection>
      <styled.HeaderContainer>
        <Image
          width={32}
          height={32}
          alt="Cadence Icon"
          src={cadenceLogoBlack}
        />
        <styled.DomainInfoContainer>
          <styled.DomainNameLabel>
            {props.domain}
            <Suspense>
              <DomainPageHeaderStatusTag
                domain={props.domain}
                cluster={props.cluster}
              />
            </Suspense>
          </styled.DomainNameLabel>
          <Suspense fallback={<DomainPageHeaderInfo loading />}>
            <DomainPageHeaderInfoLoader
              domain={props.domain}
              cluster={props.cluster}
            />
          </Suspense>
        </styled.DomainInfoContainer>
      </styled.HeaderContainer>
    </PageSection>
  );
}
