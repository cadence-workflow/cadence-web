'use client';
import { useContext, useEffect } from 'react';

import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';

import { MarkdownContext } from '../../markdown-context-provider/markdown-context-provider';

import { overrides } from './input-field.styles';
import { type InputFieldProps } from './input-field.types';

export default function InputField({
  name,
  label,
  type = 'text',
  default: defaultValue,
  required = false,
  placeholder,
}: InputFieldProps) {
  const { fieldValues, setFieldValue, registerField, unregisterField } =
    useContext(MarkdownContext);

  useEffect(() => {
    registerField?.(
      name,
      { type, required },
      defaultValue === undefined ? undefined : String(defaultValue)
    );
    return () => unregisterField?.(name);
  }, [registerField, unregisterField, name, type, required, defaultValue]);

  return (
    <FormControl label={label} overrides={overrides.formControl}>
      <Input
        size="compact"
        id={`markdown-field-${name}`}
        name={name}
        aria-label={label ? undefined : name}
        type={type === 'number' ? 'number' : 'text'}
        required={required}
        placeholder={placeholder}
        value={
          fieldValues && Object.hasOwn(fieldValues, name)
            ? fieldValues[name]
            : ''
        }
        onChange={(e) => setFieldValue?.(name, e.currentTarget.value)}
      />
    </FormControl>
  );
}
