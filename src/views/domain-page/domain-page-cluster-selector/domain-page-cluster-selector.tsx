'use client';
import React from 'react';
import { Select, SIZE } from 'baseui/select';
import { type Route } from 'next';
import { useRouter, useParams } from 'next/navigation';

import { overrides, styled } from './domain-page-cluster-selector.styles';
import { type DomainHeaderInfoItemContentProps } from '../domain-page-header-info/domain-page-header-info.types';

export default function DomainPageClusterSelector(
  props: DomainHeaderInfoItemContentProps
) {
  const router = useRouter();
  const { domain: encodedDomain, domainTab: encodedDomainTab } = useParams();

  if (props.domainInfo.clusters?.length === 1) {
    return <styled.ItemLabel>{props.cluster}</styled.ItemLabel>;
  }

  return (
    <Select
      overrides={overrides.select}
      options={props.domainInfo.clusters.map((cluster) => ({
        id: cluster.clusterName,
        label: cluster.clusterName,
      }))}
      value={[
        {
          id: props.cluster,
          label: props.cluster,
        },
      ]}
      onChange={({ option }) => {
        if (option?.id && option.id !== props.cluster) {
          const newPath =
            `/domains/${encodedDomain}/${encodeURIComponent(option.id)}/${encodedDomainTab}` as Route;
          router.push(newPath);
        }
      }}
      placeholder=""
      size={SIZE.mini}
      backspaceRemoves={false}
      clearable={false}
      deleteRemoves={false}
      escapeClearsValue={false}
    />
  );
}
