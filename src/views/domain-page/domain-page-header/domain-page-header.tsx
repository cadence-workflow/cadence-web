'use client';
import React from 'react';

import { Cell, Grid } from 'baseui/layout-grid';
import Image from 'next/image';

import cadenceLogoBlack from '@/assets/cadence-logo-black.svg';

import { styled } from './domain-page-header.styles';
import { type Props } from './domain-page-header.types';

export default function DomainPageHeader(props: Props) {
  return (
    <section>
      <Grid>
        <Cell span={12}>
          <styled.HeaderContainer>
            <Image
              width={32}
              height={32}
              alt="Cadence Icon"
              src={cadenceLogoBlack}
            />
            <styled.DomainInfoContainer>
              <styled.DomainNameLabel>{props.domain}</styled.DomainNameLabel>
              {props.domainMetadata}
            </styled.DomainInfoContainer>
          </styled.HeaderContainer>
        </Cell>
      </Grid>
    </section>
  );
}
