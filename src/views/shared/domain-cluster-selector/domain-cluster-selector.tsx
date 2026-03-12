'use client';
import React from 'react';

import { mergeOverrides } from 'baseui';
import { Select } from 'baseui/select';
import { useRouter, useParams } from 'next/navigation';

import decodeUrlParams from '@/utils/decode-url-params';
import { type DomainPageTabsParams } from '@/views/domain-page/domain-page-tabs/domain-page-tabs.types';

import { overrides, styled } from './domain-cluster-selector.styles';
import type { Props } from './domain-cluster-selector.types';
import buildDomainClusterPath from './helpers/build-domain-cluster-path';
import getClusterReplicationStatusLabel from './helpers/get-cluster-replication-status-label';

export default function DomainClusterSelector({
  domainDescription,
  cluster,
  buildPathForCluster,
  singleClusterFallbackType = 'label',
  noSpacing = false,
}: Props): React.ReactNode {
  const router = useRouter();
  const encodedParams = useParams<DomainPageTabsParams>();
  const decodedParams = decodeUrlParams(encodedParams) as DomainPageTabsParams;

  const hasMultipleClusters =
    domainDescription.clusters && domainDescription.clusters.length > 1;

  if (!hasMultipleClusters) {
    if (singleClusterFallbackType === 'label') {
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
    buildPathForCluster ??
    ((newCluster: string) =>
      buildDomainClusterPath({
        domain: decodedParams.domain,
        cluster: newCluster,
        domainTab: decodedParams.domainTab,
      }));

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
