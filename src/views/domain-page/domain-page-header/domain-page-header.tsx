'use client';
import React from 'react';
import Image from 'next/image';
import { Cell, Grid } from 'baseui/layout-grid';

import cadenceLogoBlack from '@/assets/cadence-logo-black.svg';

import { type Props } from './domain-page-header.types';
import { styled } from './domain-page-header.styles';

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
