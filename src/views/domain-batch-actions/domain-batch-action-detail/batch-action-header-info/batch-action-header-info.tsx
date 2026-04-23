'use client';
import React from 'react';

import BatchActionHeaderInfoItem from './batch-action-header-info-item/batch-action-header-info-item';
import batchActionHeaderInfoItemsConfig from './batch-action-header-info-items.config';
import { styled } from './batch-action-header-info.styles';
import {
  type BatchActionHeaderInfoItemConfig,
  type Props,
} from './batch-action-header-info.types';

export default function BatchActionHeaderInfo({ batchAction }: Props) {
  return (
    <styled.DetailsContainer>
      {batchActionHeaderInfoItemsConfig
        .filter(
          (configItem: BatchActionHeaderInfoItemConfig) =>
            !configItem.hidden?.({ batchAction })
        )
        .map((configItem: BatchActionHeaderInfoItemConfig) => (
          <BatchActionHeaderInfoItem
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
