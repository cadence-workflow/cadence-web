import React from 'react';
import { Skeleton } from 'baseui/skeleton';

import { overrides, styled } from './domain-page-header-info-item.styles';
import { type Props } from './domain-page-header-info-item.types';

export default function DomainPageHeaderInfoItem(props: Props) {
  return (
    <styled.ItemContainer>
      <styled.ItemTitle>{props.title}</styled.ItemTitle>
      {props.loading ? (
        <Skeleton
          width={props.placeholderSize}
          overrides={overrides.skeleton}
          animation={true}
        />
      ) : (
        <styled.Item $isString={typeof props.content === 'string'}>
          {props.content}
        </styled.Item>
      )}
    </styled.ItemContainer>
  );
}
