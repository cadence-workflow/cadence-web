'use client';
import React from 'react';

import { Select, SIZE } from 'baseui/select';
import { type Route } from 'next';
import { useRouter, useParams } from 'next/navigation';

import { type DomainHeaderInfoItemContentProps } from '../domain-page-header-info/domain-page-header-info.types';
import getClusterReplicationStatusLabel from '../helpers/get-cluster-replication-status-label';

import { overrides, styled } from './domain-page-cluster-selector.styles';

export default function DomainPageClusterSelector(
  props: DomainHeaderInfoItemContentProps
) {
  const router = useRouter();
  const { domain: encodedDomain, domainTab: encodedDomainTab } = useParams();

  if (props.domainDescription.clusters?.length === 1) {
    return <styled.ItemLabel>{props.cluster}</styled.ItemLabel>;
  }

  const clusterSelectorOptions = props.domainDescription.clusters.map(
    (cluster) => {
      const replicationStatusLabel = getClusterReplicationStatusLabel(
        props.domainDescription,
        cluster.clusterName
      );

      return {
        id: cluster.clusterName,
        label: replicationStatusLabel
          ? `${cluster.clusterName} (${replicationStatusLabel})`
          : cluster.clusterName,
      };
    }
  );

  return (
    <Select
      overrides={overrides.select}
      options={clusterSelectorOptions}
      value={[
        clusterSelectorOptions.find(({ id }) => id === props.cluster) ?? {
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
