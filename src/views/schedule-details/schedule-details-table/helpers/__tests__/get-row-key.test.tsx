import React from 'react';

import getRowKey from '../get-row-key';

describe(getRowKey.name, () => {
  it('builds a key from string labels and index', () => {
    expect(getRowKey({ label: 'Name' }, 0)).toBe('Name-0');
    expect(getRowKey({ label: 'Name' }, 2)).toBe('Name-2');
  });

  it('uses a generic label when label is not a string', () => {
    expect(getRowKey({ label: <span>Name</span> }, 1)).toBe('row-1');
  });
});
