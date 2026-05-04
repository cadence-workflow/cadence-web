'use client';
import React from 'react';

import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';

import LabelWithTooltip from '@/components/label-with-tooltip/label-with-tooltip';

import {
  overrides,
  styled,
} from './domain-batch-actions-new-action-params.styles';
import { type Props } from './domain-batch-actions-new-action-params.types';

export default function DomainBatchActionsNewActionParams({
  description,
  rps,
  onDescriptionChange,
  onRpsChange,
  descriptionError,
  rpsError,
}: Props) {
  return (
    <styled.Container>
      <styled.DescriptionField>
        <FormControl
          label={<LabelWithTooltip label="Description" />}
          overrides={overrides.formControl}
          error={descriptionError}
        >
          <Input
            size="compact"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            aria-label="Description"
            error={Boolean(descriptionError)}
          />
        </FormControl>
      </styled.DescriptionField>
      <styled.RpsField>
        <FormControl
          label={
            <LabelWithTooltip
              label="RPS"
              tooltip="Requests per second limit for the batch operation"
            />
          }
          overrides={overrides.formControl}
          error={rpsError}
        >
          <Input
            size="compact"
            type="number"
            value={String(rps)}
            onChange={(e) =>
              onRpsChange(
                e.target.value === '' ? 0 : parseInt(e.target.value, 10)
              )
            }
            aria-label="RPS"
            error={Boolean(rpsError)}
          />
        </FormControl>
      </styled.RpsField>
    </styled.Container>
  );
}
