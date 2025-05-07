import React from 'react';

import { styled } from './list-table-nested.styles';
import type { Props } from './list-table-nested.types';
import SublistTable from './sublist-table/sublist-table';

/**
 * Renders a responsive table for displaying items as label-value pairs, or groups of label-value pairs.
 * Suitable for presenting grouped key-value data.
 */
export default function ListTableNested({ items }: Props) {
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
            <SublistTable items={item.items} />
          ) : (
            <styled.ContentContainer>{item.value}</styled.ContentContainer>
          )}
        </styled.TableRow>
      ))}
    </styled.Table>
  );
}
