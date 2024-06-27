'use client';
import React from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import ListTable from '@/components/list-table/list-table';
import PageSection from '@/components/page-section/page-section';
import request from '@/utils/request';

import domainPageMetadataTableConfig from '../config/domain-page-metadata-table.config';
import { type DomainPageTabContentProps } from '../domain-page-content/domain-page-content.types';
import { type DomainInfo } from '../domain-page.types';

import { styled } from './domain-page-metadata.styles';

export default function DomainPageMetadata(props: DomainPageTabContentProps) {
  const { data: domainInfo } = useSuspenseQuery<DomainInfo>({
    queryKey: ['describeDomain', props],
    queryFn: () =>
      request(`/api/domains/${props.domain}/${props.cluster}`).then((res) =>
        res.json()
      ),
  });

  return (
    <PageSection>
      <styled.MetadataContainer>
        <ListTable
          data={domainInfo}
          listTableConfig={domainPageMetadataTableConfig}
        />
      </styled.MetadataContainer>
    </PageSection>
  );
}
