'use client';

import React from 'react';

import { FormControl } from 'baseui/form-control';
import { mergeOverrides } from 'baseui/helpers/overrides';

import { overrides, styled } from './domain-schedules-horizontal-field.styles';
import { type Props } from './domain-schedules-horizontal-field.types';

export default function DomainSchedulesHorizontalField({
  label,
  description,
  htmlFor,
  error,
  caption,
  overrides: externalOverrides,
  subfield = false,
  children,
}: Props) {
  return (
    <styled.FieldRow $bordered={subfield}>
      <styled.FieldLabelColumn $indent={subfield}>
        {htmlFor ? (
          <styled.FieldLabel htmlFor={htmlFor}>{label}</styled.FieldLabel>
        ) : (
          <styled.FieldLabelText>{label}</styled.FieldLabelText>
        )}
        {description ? (
          <styled.FieldDescription>{description}</styled.FieldDescription>
        ) : null}
      </styled.FieldLabelColumn>
      <styled.FieldControlColumn $indent={subfield}>
        <FormControl
          error={error}
          caption={caption}
          overrides={mergeOverrides(
            overrides.horizontalFieldFormControl,
            externalOverrides?.FormControl?.props?.overrides
          )}
        >
          {children}
        </FormControl>
      </styled.FieldControlColumn>
    </styled.FieldRow>
  );
}
