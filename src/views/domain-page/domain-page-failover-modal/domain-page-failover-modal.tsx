import { useMemo } from 'react';

import { Modal, ModalBody, ModalButton } from 'baseui/modal';
import { Table } from 'baseui/table-semantic';

import FormattedDate from '@/components/formatted-date/formatted-date';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';

import DomainPageFailoverSingleCluster from '../domain-page-failover-single-cluster/domain-page-failover-single-cluster';

import { overrides, styled } from './domain-page-failover-modal.styles';
import { type Props } from './domain-page-failover-modal.types';

export default function DomainPageFailoverModal({
  failoverEvent,
  isOpen,
  onClose,
}: Props) {
  const tableRows = useMemo(() => {
    return failoverEvent.clusterFailovers.map((clusterFailover) => {
      const fromCluster = clusterFailover.fromCluster?.activeClusterName;
      const toCluster = clusterFailover.toCluster?.activeClusterName;
      const clusters = (
        <DomainPageFailoverSingleCluster
          fromCluster={fromCluster}
          toCluster={toCluster}
        />
      );

      const attribute = clusterFailover.clusterAttribute;
      if (attribute === null) {
        return {
          scope: 'Default',
          attribute: '-',
          clusters,
        };
      }

      return {
        scope: attribute.scope,
        attribute: attribute.name,
        clusters,
      };
    });
  }, [failoverEvent.clusterFailovers]);

  const formattedTime = useMemo(() => {
    if (!failoverEvent.createdTime) return null;
    return parseGrpcTimestamp(failoverEvent.createdTime);
  }, [failoverEvent.createdTime]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeable
      overrides={overrides.modal}
    >
      <styled.ModalHeader>Failover Information</styled.ModalHeader>
      <ModalBody>
        <styled.InfoRow>
          <styled.InfoItem>
            <styled.InfoLabel>ID</styled.InfoLabel>
            <styled.InfoValue>{failoverEvent.id}</styled.InfoValue>
          </styled.InfoItem>
          <styled.InfoItem>
            <styled.InfoLabel>Time</styled.InfoLabel>
            <styled.InfoValue>
              <FormattedDate timestampMs={formattedTime} />
            </styled.InfoValue>
          </styled.InfoItem>
        </styled.InfoRow>
        {tableRows.length > 0 && (
          <styled.TableContainer>
            <Table
              size="compact"
              divider="clean"
              overrides={overrides.table}
              columns={['Scope', 'Attribute', 'Clusters']}
              data={tableRows.map(Object.values)}
            />
          </styled.TableContainer>
        )}
      </ModalBody>
      <styled.ModalFooter>
        <ModalButton size="compact" kind="primary" onClick={onClose}>
          Close
        </ModalButton>
      </styled.ModalFooter>
    </Modal>
  );
}
