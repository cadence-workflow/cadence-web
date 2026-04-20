import type React from 'react';

import { type BatchAction } from '@/views/domain-batch-actions/domain-batch-actions.types';

export type BatchActionHeaderInfoItemProps = {
  batchAction: BatchAction;
};

interface InfoItemBase {
  title: string;
  placeholderSize: string;
  hidden?: (props: BatchActionHeaderInfoItemProps) => boolean;
}

interface InfoItemComponent extends InfoItemBase {
  component: React.ComponentType<BatchActionHeaderInfoItemProps>;
  getLabel?: never;
}

interface InfoItemLabel extends InfoItemBase {
  getLabel: (props: BatchActionHeaderInfoItemProps) => string;
  component?: never;
}

export type BatchActionHeaderInfoItemConfig = InfoItemComponent | InfoItemLabel;

export type BatchActionHeaderInfoItemsConfig =
  Array<BatchActionHeaderInfoItemConfig>;
