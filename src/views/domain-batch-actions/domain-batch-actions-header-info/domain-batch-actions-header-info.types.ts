import type React from 'react';

import { type BatchAction } from '@/views/domain-batch-actions/domain-batch-actions.types';

export type Props = {
  batchAction?: BatchAction;
  loading?: boolean;
  onEditRps?: () => void;
};

export type DomainBatchActionHeaderInfoItemProps = {
  batchAction: BatchAction;
  onEditRps?: () => void;
};

export type DomainBatchActionHeaderInfoItemConfig = {
  title: string;
  placeholderSize: string;
  hidden?: (props: DomainBatchActionHeaderInfoItemProps) => boolean;
  render: (props: DomainBatchActionHeaderInfoItemProps) => React.ReactNode;
};

export type DomainBatchActionHeaderInfoItemsConfig =
  Array<DomainBatchActionHeaderInfoItemConfig>;
