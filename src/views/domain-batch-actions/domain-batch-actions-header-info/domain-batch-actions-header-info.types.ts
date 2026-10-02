import type React from 'react';

import { type BatchAction } from '@/views/domain-batch-actions/domain-batch-actions.types';

export type Props = {
  batchAction?: BatchAction;
  loading?: boolean;
  domain: string;
  cluster: string;
  workflowId: string;
};

export type DomainBatchActionHeaderInfoItemProps = {
  batchAction: BatchAction;
  domain: string;
  cluster: string;
  workflowId: string;
};

export type DomainBatchActionHeaderInfoItemConfig = {
  title: string;
  placeholderSize: string;
  hidden?: (
    props: Pick<DomainBatchActionHeaderInfoItemProps, 'batchAction'>
  ) => boolean;
  render: (props: DomainBatchActionHeaderInfoItemProps) => React.ReactNode;
};

export type DomainBatchActionHeaderInfoItemsConfig =
  Array<DomainBatchActionHeaderInfoItemConfig>;
