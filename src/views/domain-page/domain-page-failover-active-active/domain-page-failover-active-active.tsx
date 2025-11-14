import { useMemo, useState } from 'react';

import { Button } from 'baseui/button';
import { MdVisibility } from 'react-icons/md';

import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';

import domainPageQueryParamsConfig from '../config/domain-page-query-params.config';
import DomainPageFailoverModal from '../domain-page-failover-modal/domain-page-failover-modal';
import DomainPageFailoverSingleCluster from '../domain-page-failover-single-cluster/domain-page-failover-single-cluster';
import { PRIMARY_CLUSTER_SCOPE } from '../domain-page-failovers/domain-page-failovers.constants';
import clusterFailoverMatchesAttribute from '../helpers/cluster-failover-matches-attribute';

import { styled } from './domain-page-failover-active-active.styles';
import { type Props } from './domain-page-failover-active-active.types';

export default function DomainPageFailoverActiveActive({
  failoverEvent,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [{ clusterAttributeScope, clusterAttributeValue }] = usePageQueryParams(
    domainPageQueryParamsConfig
  );

  const clusterFailoverForMaybeSelectedAttribute = useMemo(() => {
    if (
      !clusterAttributeScope ||
      (clusterAttributeScope !== PRIMARY_CLUSTER_SCOPE &&
        !clusterAttributeValue)
    )
      return undefined;

    return failoverEvent.clusterFailovers.find((clusterFailover) =>
      clusterFailoverMatchesAttribute(
        clusterFailover,
        clusterAttributeScope,
        clusterAttributeValue
      )
    );
  }, [
    clusterAttributeScope,
    clusterAttributeValue,
    failoverEvent.clusterFailovers,
  ]);

  return (
    <>
      <styled.FailoverEventContainer>
        {clusterFailoverForMaybeSelectedAttribute && (
          <styled.ClusterFailoverContainer>
            <styled.ClusterAttributeLabel>
              {clusterAttributeScope === PRIMARY_CLUSTER_SCOPE
                ? 'Primary:'
                : `${clusterAttributeScope} (${clusterAttributeValue}):`}
            </styled.ClusterAttributeLabel>
            <DomainPageFailoverSingleCluster
              fromCluster={
                clusterFailoverForMaybeSelectedAttribute.fromCluster
                  ?.activeClusterName
              }
              toCluster={
                clusterFailoverForMaybeSelectedAttribute.toCluster
                  ?.activeClusterName
              }
            />
          </styled.ClusterFailoverContainer>
        )}
        <Button
          size="mini"
          kind="secondary"
          shape="pill"
          endEnhancer={<MdVisibility />}
          onClick={() => setIsModalOpen(true)}
        >
          See more
        </Button>
      </styled.FailoverEventContainer>
      <DomainPageFailoverModal
        failoverEvent={failoverEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
