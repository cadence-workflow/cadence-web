'use client';
import React from 'react';

import { Select, SIZE } from 'baseui/select';
import { type Route } from 'next';
import { useRouter, useParams } from 'next/navigation';

import decodeUrlParams from '@/utils/decode-url-params';
import getClusterReplicationStatusLabel from '@/views/domain-page/helpers/get-cluster-replication-status-label';

import { overrides, styled } from './domain-cluster-selector.styles';
import type {
  BuildPathForClusterParams,
  Props,
} from './domain-cluster-selector.types';
import { DomainPageTabsParams } from '@/views/domain-page/domain-page-tabs/domain-page-tabs.types';

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
  const decodedParams = decodeUrlParams(encodedParams) as DomainPageTabsParams;

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
    ((params: BuildPathForClusterParams) => {
      const domainTabSegment = params.domainTab
        ? `/${encodeURIComponent(params.domainTab)}`
        : '';

      return `/domains/${encodeURIComponent(params.domainName)}/${encodeURIComponent(params.newCluster)}${domainTabSegment}` as Route;
    });

  return (
    <Select
      overrides={overrides.select}
      // @ts-ignore : TODO @assem.hafez: find the recommended solution for this
      $noSpacing={noSpacing}
      options={clusterSelectorOptions}
      value={[
        clusterSelectorOptions.find(({ id }) => id === cluster) ?? {
          id: cluster,
          label: cluster,
        },
      ]}
      onChange={({ option }) => {
        if (option?.id != null && String(option.id) !== cluster) {
          router.push(
            buildPath({
              newCluster: String(option.id),
              domainName: decodedParams.domain ?? '',
              domainTab: decodedParams.domainTab ?? '',
            })
          );
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
