'use client';
import React from 'react';

import { mergeOverrides } from 'baseui';
import { Select, SIZE } from 'baseui/select';
import { type Route } from 'next';
import { useRouter, useParams } from 'next/navigation';

import { type DomainPageTabsParams } from '@/views/domain-page/domain-page-tabs/domain-page-tabs.types';
import getClusterReplicationStatusLabel from '@/views/domain-page/helpers/get-cluster-replication-status-label';

import { overrides, styled } from './domain-cluster-selector.styles';
import type { Props } from './domain-cluster-selector.types';

export default function DomainClusterSelector({
  domainDescription,
  cluster,
  getReplicationStatusLabel = getClusterReplicationStatusLabel,
  buildPathForCluster: buildPathForClusterProp,
  singleClusterRender = 'label',
  noSpacing = false,
}: Props): React.ReactNode {
  const router = useRouter();
  const encodedParams = useParams<DomainPageTabsParams>();

  const hasMultipleClusters =
    domainDescription.clusters && domainDescription.clusters.length > 1;

  if (!hasMultipleClusters) {
    if (singleClusterRender === 'label') {
      return <styled.ItemLabel>{cluster}</styled.ItemLabel>;
    }
    return null;
  }

  const clusterSelectorOptions = (domainDescription.clusters ?? []).map((c) => {
    const replicationStatusLabel = getReplicationStatusLabel(
      domainDescription,
      c.clusterName
    );

    return {
      id: c.clusterName,
      label: replicationStatusLabel
        ? `${c.clusterName} (${replicationStatusLabel})`
        : c.clusterName,
    };
  });

  const buildPath =
    buildPathForClusterProp ??
    ((newCluster: string) => {
      const domainTabSegment = encodedParams.domainTab
        ? `/${encodedParams.domainTab}`
        : '';

      return `/domains/${encodeURIComponent(encodedParams.domain)}/${encodeURIComponent(newCluster)}${domainTabSegment}` as Route;
    });

  return (
    <Select
      overrides={
        noSpacing
          ? overrides.baseSelect
          : mergeOverrides(overrides.baseSelect, overrides.spacedSelect)
      }
      options={clusterSelectorOptions}
      value={[
        clusterSelectorOptions.find(({ id }) => id === cluster) ?? {
          id: cluster,
          label: cluster,
        },
      ]}
      onChange={({ option }) => {
        if (option?.id != null && String(option.id) !== cluster) {
          router.push(buildPath(String(option.id)));
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
