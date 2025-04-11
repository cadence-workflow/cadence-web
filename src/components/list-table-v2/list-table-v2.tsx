import React from 'react';

import { styled } from './list-table-v2.styles';
import type { Props } from './list-table-v2.types';

export default function ListTableV2({ items }: Props) {
  return (
    <styled.Table>
      {items.map((item) => (
        <styled.TableRow key={item.key}>
          <styled.TitleBlock>
            <styled.Title>{item.label}</styled.Title>
            {item.description && (
              <styled.Description>{item.description}</styled.Description>
            )}
          </styled.TitleBlock>
          {item.kind === 'group' ? (
            <styled.Sublist>
              {item.items.map((sublistItem) => (
                <styled.SublistItem key={sublistItem.key}>
                  <styled.SublistItemLabel>
                    {sublistItem.label}
                  </styled.SublistItemLabel>
                  <styled.SublistItemValue>
                    {sublistItem.value}
                  </styled.SublistItemValue>
                </styled.SublistItem>
              ))}
            </styled.Sublist>
          ) : (
            <styled.ContentContainer>{item.value}</styled.ContentContainer>
          )}
        </styled.TableRow>
      ))}
    </styled.Table>
  );
}
