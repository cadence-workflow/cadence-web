'use client';
import React, { useCallback, useMemo } from 'react';

import { Button } from 'baseui/button';
import { FormControl } from 'baseui/form-control';
import { Textarea } from 'baseui/textarea';
import { MdAdd, MdDeleteOutline } from 'react-icons/md';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import { cssStyles, overrides } from './multi-json-input.styles';
import type { Props } from './multi-json-input.types';

export default function MultiJsonInput({
  label,
  placeholder,
  value = [''],
  onChange,
  error,
  addButtonText = 'Add',
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);

  const getInputError = useCallback(
    (index: number): boolean => {
      if (!error) return false;
      if (typeof error === 'string') return true; // Global error affects all
      if (Array.isArray(error)) return Boolean(error[index]);
      return false;
    },
    [error]
  );

  const getGlobalErrorMessage = useCallback((): string | undefined => {
    if (typeof error === 'string') return error;
    return undefined;
  }, [error]);

  const displayValue = useMemo(() => {
    return value && value.length > 0 ? value : [''];
  }, [value]);

  const canAddMore = useMemo(() => {
    return displayValue.every((item: string) => item.trim() !== '');
  }, [displayValue]);

  const handleInputChange = useCallback(
    (index: number, newValue: string) => {
      const newArray = [...displayValue];
      newArray[index] = newValue;
      onChange(newArray);
    },
    [displayValue, onChange]
  );

  const handleAddInput = useCallback(() => {
    if (canAddMore) {
      onChange([...displayValue, '']);
    }
  }, [canAddMore, displayValue, onChange]);

  const handleDeleteInput = useCallback(
    (index: number) => {
      if (displayValue.length === 1) {
        // If only one input, clear it instead of deleting
        onChange(['']);
      } else {
        // Remove the input at the specified index
        const newArray = displayValue.filter(
          (_: string, i: number) => i !== index
        );
        onChange(newArray);
      }
    },
    [displayValue, onChange]
  );

  const isDeleteDisabled = useMemo(() => {
    return displayValue.length === 1 && displayValue[0] === '';
  }, [displayValue]);

  return (
    <FormControl label={label} error={getGlobalErrorMessage()}>
      <div className={cls.container}>
        {displayValue.map((inputValue: string, index: number) => (
          <div key={index} className={cls.inputRow}>
            <div className={cls.inputContainer}>
              <Textarea
                aria-label={label}
                overrides={overrides.jsonInput}
                value={inputValue}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder={placeholder}
                size="compact"
                error={getInputError(index)}
              />
            </div>
            <div className={cls.buttonContainer}>
              <Button
                size="mini"
                kind="tertiary"
                shape="circle"
                onClick={() => {
                  handleDeleteInput(index);
                }}
                disabled={isDeleteDisabled}
                aria-label={
                  displayValue.length === 1 ? 'Clear input' : 'Delete input'
                }
              >
                <MdDeleteOutline size={16} />
              </Button>
            </div>
          </div>
        ))}
        <div className={cls.addButtonContainer}>
          <Button
            size="mini"
            kind="secondary"
            shape="pill"
            onClick={handleAddInput}
            disabled={!canAddMore}
            startEnhancer={<MdAdd size={16} />}
          >
            {addButtonText}
          </Button>
        </div>
      </div>
    </FormControl>
  );
}
