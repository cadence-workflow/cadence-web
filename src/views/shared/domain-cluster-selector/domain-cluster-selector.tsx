'use client';
import React from 'react';

import { mergeOverrides } from 'baseui';
import { Select } from 'baseui/select';
import { useRouter, useParams } from 'next/navigation';

import { type DomainPageTabsParams } from '@/views/domain-page/domain-page-tabs/domain-page-tabs.types';

import { overrides, styled } from './domain-cluster-selector.styles';
import type { Props } from './domain-cluster-selector.types';
import getClusterReplicationStatusLabel from './helpers/get-cluster-replication-status-label';

export default function DomainClusterSelector({
  domainDescription,
  cluster,
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
    const replicationStatusLabel = getClusterReplicationStatusLabel(
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
        if (option?.id && String(option.id) !== cluster) {
          router.push(buildPath(String(option.id)));
        }
      }}
      placeholder=""
      size="mini"
      backspaceRemoves={false}
      clearable={false}
      deleteRemoves={false}
      escapeClearsValue={false}
    />
  );
}
