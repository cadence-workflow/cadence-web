'use client';
import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, SIZE } from 'baseui/button';
import { FormControl } from 'baseui/form-control';
import { useForm, Controller } from 'react-hook-form';
import { type z } from 'zod';

import getInitialValues from './helpers/get-initial-values';
import { styled } from './settings-form.styles';
import { type SettingsFormValues, type Props } from './settings-form.types';

export default function SettingsForm<D extends object, Z extends z.ZodTypeAny>({
  data,
  zodSchema,
  formConfig,
  onSubmit,
  submitButtonText,
  onSubmitError,
}: Props<D, Z>) {
  const { control, handleSubmit, formState, reset } = useForm<
    SettingsFormValues<Z>
  >({
    mode: 'onBlur',
    values: getInitialValues({ data, formConfig }),
    resolver: zodResolver(zodSchema),
  });

  useEffect(() => {
    reset();
  }, [data, reset]);

  return (
    <form
      onSubmit={(event) => {
        // Prevent form from clearing itself on submit
        event.preventDefault();
        handleSubmit(onSubmit)(event).catch(onSubmitError);
      }}
    >
      <styled.FieldsContainer>
        {formConfig.map((field) => {
          return (
            <styled.FieldContainer key={field.path}>
              <styled.Info>
                <styled.Title>{field.title}</styled.Title>
                <styled.Description>{field.description}</styled.Description>
              </styled.Info>
              <FormControl
                error={formState.errors[field.path]?.message?.toString()}
              >
                <Controller
                  control={control}
                  name={field.path}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <field.component
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      error={error?.message}
                    />
                  )}
                />
              </FormControl>
            </styled.FieldContainer>
          );
        })}
      </styled.FieldsContainer>
      <styled.ButtonContainer>
        <Button
          type="submit"
          size={SIZE.compact}
          disabled={!formState.isDirty || !formState.isValid}
          isLoading={formState.isSubmitting || formState.isSubmitSuccessful}
        >
          {submitButtonText}
        </Button>
      </styled.ButtonContainer>
    </form>
  );
}
