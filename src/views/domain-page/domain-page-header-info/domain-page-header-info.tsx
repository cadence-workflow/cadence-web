'use client';
import React from 'react';

import domainPageHeaderInfoItemsConfig from '../config/domain-page-header-info-items.config';
import DomainPageHeaderInfoItem from '../domain-page-header-info-item/domain-page-header-info-item';

import { styled } from './domain-page-header-info.styles';
import {
  type DomainPageHeaderInfoItemConfig,
  type Props,
} from './domain-page-header-info.types';

export default function DomainPageHeaderInfo(props: Props) {
  return (
    <styled.DomainDetailsContainer>
      {domainPageHeaderInfoItemsConfig.map(
        (configItem: DomainPageHeaderInfoItemConfig) => (
          <DomainPageHeaderInfoItem
            key={configItem.title}
            title={configItem.title}
            loading={props.loading}
            content={
              !props.loading &&
              !!props.domainInfo &&
              (configItem.component ? (
                <configItem.component
                  domainInfo={props.domainInfo}
                  cluster={props.cluster}
                />
              ) : (
                configItem.getLabel({
                  domainInfo: props.domainInfo,
                  cluster: props.cluster,
                })
              ))
            }
            placeholderSize={configItem.placeholderSize}
          />
        )
      )}
    </styled.DomainDetailsContainer>
  );
}
