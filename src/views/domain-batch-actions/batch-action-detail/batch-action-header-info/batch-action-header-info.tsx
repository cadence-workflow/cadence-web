'use client';
import React from 'react';

import { type BatchAction } from '@/views/domain-batch-actions/domain-batch-actions.types';

import BatchActionHeaderInfoItem from './batch-action-header-info-item/batch-action-header-info-item';
import batchActionHeaderInfoItemsConfig from './batch-action-header-info-items.config';
import { styled } from './batch-action-header-info.styles';
import { type BatchActionHeaderInfoItemConfig } from './batch-action-header-info.types';

type Props = {
  batchAction: BatchAction;
};

export default function BatchActionHeaderInfo({ batchAction }: Props) {
  return (
    <styled.DetailsContainer>
      {batchActionHeaderInfoItemsConfig.map(
        (configItem: BatchActionHeaderInfoItemConfig) => (
          <BatchActionHeaderInfoItem
            key={configItem.title}
            title={configItem.title}
            loading={false}
            content={
              configItem.component ? (
                <configItem.component batchAction={batchAction} />
              ) : (
                configItem.getLabel({ batchAction })
              )
            }
            placeholderSize={configItem.placeholderSize}
          />
        )
      )}
    </styled.DetailsContainer>
  );
}
