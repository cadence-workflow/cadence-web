'use client';
import React from 'react';

import { styled } from './list-table.styles';
import type { Props } from './list-table.types';

/**
 * Renders a responsive table for displaying items as label-value pairs.
 * Suitable for presenting simple key-value data.
 */
export default function ListTable<T extends object>({
  data,
  listTableConfig,
}: Props<T>) {
  return (
    <div>
      {listTableConfig.map((tableItem) => (
        <styled.ListRow key={tableItem.key}>
          <styled.ListItemLabel>{tableItem.label}:</styled.ListItemLabel>
          <styled.ListItemValue>
            <tableItem.renderValue {...data} />
          </styled.ListItemValue>
        </styled.ListRow>
      ))}
    </div>
  );
}
