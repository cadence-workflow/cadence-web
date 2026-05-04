'use client';
import React from 'react';

import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Controller } from 'react-hook-form';

import LabelWithTooltip from '@/components/label-with-tooltip/label-with-tooltip';

import {
  overrides,
  styled,
} from './domain-batch-actions-new-action-params.styles';
import { type Props } from './domain-batch-actions-new-action-params.types';

export default function DomainBatchActionsNewActionParams({
  control,
  fieldErrors,
}: Props) {
  return (
    <styled.Container>
      <styled.DescriptionField>
        <FormControl
          label={<LabelWithTooltip label="Description" />}
          overrides={overrides.formControl}
          error={fieldErrors.description?.message}
        >
          <Controller
            name="description"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <Input
                {...field}
                // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                inputRef={ref}
                size="compact"
                aria-label="Description"
                error={Boolean(fieldErrors.description)}
              />
            )}
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
          error={fieldErrors.rps?.message}
        >
          <Controller
            name="rps"
            control={control}
            render={({ field: { ref, value, onChange, ...field } }) => (
              <Input
                {...field}
                // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                inputRef={ref}
                size="compact"
                type="number"
                value={String(value)}
                onChange={(e) =>
                  onChange(
                    e.target.value === '' ? 0 : parseInt(e.target.value, 10)
                  )
                }
                aria-label="RPS"
                error={Boolean(fieldErrors.rps)}
              />
            )}
          />
        </FormControl>
      </styled.RpsField>
    </styled.Container>
  );
}
