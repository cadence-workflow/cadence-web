'use client';
import React from 'react';

import batchActionHeaderInfoItemsConfig from '../config/domain-batch-actions-header-info-items.config';
import DomainBatchActionHeaderInfoItem from '../domain-batch-actions-header-info-item/domain-batch-actions-header-info-item';

import { styled } from './domain-batch-actions-header-info.styles';
import {
  type DomainBatchActionHeaderInfoItemConfig,
  type Props,
} from './domain-batch-actions-header-info.types';

export default function DomainBatchActionHeaderInfo({
  batchAction,
  loading = false,
  domain,
  cluster,
  workflowId,
}: Props) {
  return (
    <styled.DetailsContainer>
      {batchActionHeaderInfoItemsConfig
        .filter(
          (configItem: DomainBatchActionHeaderInfoItemConfig) =>
            !batchAction || !configItem.hidden?.({ batchAction })
        )
        .map((configItem: DomainBatchActionHeaderInfoItemConfig) => (
          <DomainBatchActionHeaderInfoItem
            key={configItem.title}
            title={configItem.title}
            loading={loading || !batchAction}
            content={
              batchAction
                ? configItem.render({
                    batchAction,
                    domain,
                    cluster,
                    workflowId,
                  })
                : null
            }
            placeholderSize={configItem.placeholderSize}
          />
        ))}
    </styled.DetailsContainer>
  );
}
