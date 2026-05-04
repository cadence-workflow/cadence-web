'use client';
import React from 'react';

import DomainBatchActionHeaderInfoItem from '../domain-batch-actions-header-info-item/domain-batch-actions-header-info-item';

import batchActionHeaderInfoItemsConfig from './domain-batch-actions-header-info-items.config';
import { styled } from './domain-batch-actions-header-info.styles';
import {
  type DomainBatchActionHeaderInfoItemConfig,
  type Props,
} from './domain-batch-actions-header-info.types';

export default function DomainBatchActionHeaderInfo({ batchAction }: Props) {
  return (
    <styled.DetailsContainer>
      {batchActionHeaderInfoItemsConfig
        .filter(
          (configItem: DomainBatchActionHeaderInfoItemConfig) =>
            !configItem.hidden?.({ batchAction })
        )
        .map((configItem: DomainBatchActionHeaderInfoItemConfig) => (
          <DomainBatchActionHeaderInfoItem
            key={configItem.title}
            title={configItem.title}
            loading={false}
            content={configItem.render({ batchAction })}
            placeholderSize={configItem.placeholderSize}
          />
        ))}
    </styled.DetailsContainer>
  );
}
