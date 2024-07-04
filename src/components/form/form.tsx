'use client';
import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, SIZE } from 'baseui/button';
import { FormControl } from 'baseui/form-control';
import { useForm, Controller } from 'react-hook-form';
import { type z } from 'zod';

import { styled } from './form.styles';
import { type FormValues, type Props } from './form.types';
import getDefaultValues from './helpers/get-default-values';

export default function Form<D extends object, Z extends z.ZodTypeAny>({
  data,
  zodSchema,
  formConfig,
  onSubmit,
  submitButtonText,
}: Props<D, Z>) {
  const { control, handleSubmit, formState } = useForm<FormValues<Z>>({
    mode: 'onBlur',
    defaultValues: getDefaultValues({ data, formConfig }),
    resolver: zodResolver(zodSchema),
  });

  return (
    <form
      onSubmit={(event) => {
        // Prevent form from clearing itself on submit
        event.preventDefault();
        handleSubmit(onSubmit)(event);
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
          isLoading={formState.isSubmitting}
        >
          {submitButtonText}
        </Button>
      </styled.ButtonContainer>
    </form>
  );
}
