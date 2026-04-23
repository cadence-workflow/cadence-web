import type React from 'react';

import { type BatchAction } from '@/views/domain-batch-actions/domain-batch-actions.types';

export type Props = {
  batchAction: BatchAction;
};

export type BatchActionHeaderInfoItemProps = {
  batchAction: BatchAction;
};

export type BatchActionHeaderInfoItemConfig = {
  title: string;
  placeholderSize: string;
  hidden?: (props: BatchActionHeaderInfoItemProps) => boolean;
  render: (props: BatchActionHeaderInfoItemProps) => React.ReactNode;
};

export type BatchActionHeaderInfoItemsConfig =
  Array<BatchActionHeaderInfoItemConfig>;
