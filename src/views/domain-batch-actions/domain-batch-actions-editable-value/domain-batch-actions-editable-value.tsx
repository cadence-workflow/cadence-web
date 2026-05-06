'use client';
import React from 'react';

import { MdOutlineEdit } from 'react-icons/md';

import Button from '@/components/button/button';

import {
  overrides,
  styled,
} from './domain-batch-actions-editable-value.styles';
import { type Props } from './domain-batch-actions-editable-value.types';

export default function DomainBatchActionEditableValue({
  value,
  editable,
}: Props) {
  return (
    <styled.Container>
      {value ?? '—'}
      {editable && (
        <Button
          kind="secondary"
          size="mini"
          overrides={overrides.editButton}
          startEnhancer={<MdOutlineEdit />}
        >
          Edit
        </Button>
      )}
    </styled.Container>
  );
}
