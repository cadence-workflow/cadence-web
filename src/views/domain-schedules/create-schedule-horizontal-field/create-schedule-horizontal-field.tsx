'use client';

import React from 'react';

import { FormControl } from 'baseui/form-control';

import { overrides, styled } from './create-schedule-horizontal-field.styles';
import { type Props } from './create-schedule-horizontal-field.types';

export default function CreateScheduleHorizontalField({
  label,
  description,
  htmlFor,
  error,
  children,
}: Props) {
  return (
    <styled.FieldRow>
      <styled.FieldLabelColumn>
        {htmlFor ? (
          <styled.FieldLabel htmlFor={htmlFor}>{label}</styled.FieldLabel>
        ) : (
          <styled.FieldLabelText>{label}</styled.FieldLabelText>
        )}
        {description ? (
          <styled.FieldDescription>{description}</styled.FieldDescription>
        ) : null}
      </styled.FieldLabelColumn>
      <styled.FieldControlColumn>
        <FormControl
          error={error}
          overrides={overrides.horizontalFieldFormControl}
        >
          {children}
        </FormControl>
      </styled.FieldControlColumn>
    </styled.FieldRow>
  );
}
