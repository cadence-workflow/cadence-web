import type React from 'react';

import { type BatchAction } from '@/views/domain-batch-actions/domain-batch-actions.types';

export type Props = {
  batchAction: BatchAction;
};

export type DomainBatchActionHeaderInfoItemProps = {
  batchAction: BatchAction;
};

export type DomainBatchActionHeaderInfoItemConfig = {
  title: string;
  placeholderSize: string;
  hidden?: (props: DomainBatchActionHeaderInfoItemProps) => boolean;
  render: (props: DomainBatchActionHeaderInfoItemProps) => React.ReactNode;
};

export type DomainBatchActionHeaderInfoItemsConfig =
  Array<DomainBatchActionHeaderInfoItemConfig>;
