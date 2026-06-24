import React from 'react';

export type ReadOnlyDetailsTableRow = {
  key?: React.Key;
  label: React.ReactNode;
  value?: React.ReactNode | null;
  hide?: boolean;
};

export type Props = {
  rows: ReadOnlyDetailsTableRow[];
  emptyValue?: React.ReactNode;
  ariaLabel?: string;
};
