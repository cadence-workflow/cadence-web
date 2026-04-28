import React from 'react';

import { Skeleton } from 'baseui/skeleton';

import {
  overrides,
  styled,
} from './domain-batch-actions-header-info-item.styles';
import { type Props } from './domain-batch-actions-header-info-item.types';

export default function DomainBatchActionHeaderInfoItem(props: Props) {
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
