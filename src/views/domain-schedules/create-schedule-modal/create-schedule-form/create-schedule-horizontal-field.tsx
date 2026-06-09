import React from 'react';

import { FormControl } from 'baseui/form-control';

import { overrides, styled } from './create-schedule-form.styles';

export type HorizontalFormFieldProps = {
  label: React.ReactNode;
  description?: React.ReactNode;
  /** When set, associates the left column with the control via `htmlFor` / `id`. */
  htmlFor?: string;
  error?: React.ReactNode;
  children: React.ReactNode;
};

export default function CreateScheduleHorizontalField({
  label,
  description,
  htmlFor,
  error,
  children,
}: HorizontalFormFieldProps) {
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
