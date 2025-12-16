'use client';
import React, { useCallback, useMemo } from 'react';

import { Button } from 'baseui/button';
import { DatePicker } from 'baseui/datepicker';
import { Input } from 'baseui/input';
import { Select } from 'baseui/select';
import { MdAdd, MdDeleteOutline } from 'react-icons/md';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import {
  INPUT_PLACEHOLDERS_FOR_VALUE_TYPE,
  BOOLEAN_OPTIONS,
  DATE_TIME_FORMAT,
} from './workflow-actions-search-attributes.constants';
import {
  cssStyles,
  overrides,
} from './workflow-actions-search-attributes.styles';
import type {
  Props,
  SearchAttributeItem,
  SearchAttributeOption,
} from './workflow-actions-search-attributes.types';

export default function WorkflowActionsSearchAttributes({
  isLoading = false,
  value = [],
  onChange,
  error,
  searchAttributes,
  addButtonText = 'Add search attribute',
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);

  const selectedAttributes = useMemo(() => {
    // return attributes sorted that exists in value in the same order
    return value.reduce((acc, item) => {
      const attribute = searchAttributes.find((attr) => attr.name === item.key);
      if (attribute) {
        acc.push(attribute);
      }
      return acc;
    }, [] as SearchAttributeOption[]);
  }, [searchAttributes, value]);

  const getFieldError = useCallback(
    (index: number, field: 'key' | 'value'): boolean => {
      if (typeof error === 'string') return true; // Global error affects all
      if (Array.isArray(error)) {
        const fieldError = error[index];
        if (!fieldError) return false;
        return Boolean(fieldError[field]);
      }
      return false;
    },
    [error]
  );

  // Ensure we always show at least one empty row
  const displayValue = useMemo((): SearchAttributeItem[] => {
    const items = value || [];

    if (items.length === 0) {
      return [{ key: '', value: '' }];
    }

    return items;
  }, [value]);

  const getAttributeOptionsForRow = useCallback(
    (currentKey: string) => {
      const usedKeys = (value || [])
        .map((item) => item.key)
        .filter((key) => key && key !== currentKey);

      return searchAttributes
        .filter((attr) => !usedKeys.includes(attr.name))
        .map((attr) => ({
          id: attr.name,
          label: attr.name,
          valueType: attr.valueType,
        }));
    },
    [searchAttributes, value]
  );

  const unusedSearchAttributes = useMemo(() => {
    const usedKeys = (value || []).map((item) => item.key).filter((key) => key);
    return searchAttributes.filter((attr) => !usedKeys.includes(attr.name));
  }, [searchAttributes, value]);

  const hasMoreSearchAttributes = unusedSearchAttributes.length > 0;

  const hasCompleteFields = useMemo(() => {
    const items = value || [];
    // If no items exist, we'll show one empty row - this is not incomplete
    if (items.length === 0) {
      return false;
    }

    // If items exist, ALL must have both key and value
    return items.every((item) => {
      const hasKey = item.key?.trim();
      const hasValue =
        item.value !== '' && item.value !== null && item.value !== undefined;
      // Incomplete if either key or value is missing
      return hasKey && hasValue;
    });
  }, [value]);

  const handleKeyChange = useCallback(
    (index: number, newKey: string) => {
      const newArray = [...(value || [])];
      newArray[index] = { key: newKey, value: '' };
      onChange([...newArray]);
    },
    [value, onChange]
  );

  const handleValueChange = useCallback(
    (index: number, newValue: string, valueType?: string) => {
      const newArray = [...(value || [])];
      const currentItem = newArray[index];

      if (!currentItem?.key) return; // Can't set value without key

      // Allow empty string for clearing the field
      if (newValue === '') {
        newArray[index] = { ...currentItem, value: '' };
        onChange(newArray);
        return;
      }

      // Convert value based on type
      let processedValue: string | number | boolean = newValue;

      if (valueType === 'INDEXED_VALUE_TYPE_INT') {
        processedValue = parseInt(newValue, 10);
      } else if (valueType === 'INDEXED_VALUE_TYPE_DOUBLE') {
        processedValue = parseFloat(newValue);
      } else if (valueType === 'INDEXED_VALUE_TYPE_BOOL') {
        processedValue = newValue === 'true';
      }

      newArray[index] = { ...currentItem, value: processedValue };
      onChange(newArray);
    },
    [value, onChange]
  );

  const handleAddAttribute = useCallback(() => {
    onChange([...(value || []), { key: '', value: '' }]);
  }, [value, onChange]);

  const handleDeleteAttribute = useCallback(
    (index: number) => {
      const newArray = [...(value || [])];
      newArray.splice(index, 1);
      onChange(newArray);
    },
    [value, onChange]
  );

  const renderValueInput = useCallback(
    (item: SearchAttributeItem, index: number) => {
      const selectedAttribute = selectedAttributes[index];
      const inputError = getFieldError(index, 'value');
      const inputPlaceholder =
        INPUT_PLACEHOLDERS_FOR_VALUE_TYPE[selectedAttribute?.valueType] ||
        'Enter value';

      // Common input value props
      const commonInputProps = {
        'aria-label': 'Search attribute value',
        placeholder: inputPlaceholder,
        size: 'compact' as const,
        error: inputError,
        overrides: overrides.valueInput,
      };

      switch (selectedAttribute?.valueType) {
        case 'INDEXED_VALUE_TYPE_BOOL':
          return (
            <Select
              {...commonInputProps}
              options={BOOLEAN_OPTIONS}
              value={
                item.value !== undefined && item.value !== null
                  ? BOOLEAN_OPTIONS.filter(
                      (option) => option.id === String(item.value)
                    )
                  : []
              }
              onChange={(params) => {
                handleValueChange(
                  index,
                  String(params.value[0]?.id || ''),
                  'INDEXED_VALUE_TYPE_BOOL'
                );
              }}
              clearable={false}
            />
          );

        case 'INDEXED_VALUE_TYPE_DATETIME':
          return (
            <DatePicker
              {...commonInputProps}
              value={item.value ? [new Date(String(item.value))] : []}
              onChange={({ date }) => {
                const d = Array.isArray(date) ? date[0] : date;
                if (d) {
                  handleValueChange(index, d.toISOString());
                } else {
                  handleValueChange(index, '');
                }
              }}
              timeSelectStart
              formatString={DATE_TIME_FORMAT}
            />
          );

        case 'INDEXED_VALUE_TYPE_DOUBLE':
        case 'INDEXED_VALUE_TYPE_INT':
          return (
            <Input
              {...commonInputProps}
              type="number"
              step={1}
              value={String(item.value)}
              onChange={(e) =>
                handleValueChange(
                  index,
                  e.target.value,
                  selectedAttribute?.valueType
                )
              }
            />
          );

        default:
          return (
            <Input
              {...commonInputProps}
              value={String(item.value)}
              onChange={(e) => handleValueChange(index, e.target.value)}
              disabled={!selectedAttribute?.valueType} // Disable input if no attribute type is selected
            />
          );
      }
    },
    [selectedAttributes, getFieldError, handleValueChange]
  );

  return (
    <div className={cls.container}>
      {displayValue.map((item: SearchAttributeItem, index: number) => {
        const isEmptyRow = !item.key && !item.value;
        const isLastItem = displayValue.length === 1;
        const showDeleteButton = !isEmptyRow || (value || []).length > 0;
        const deleteButtonLabel =
          isLastItem && !isEmptyRow ? 'Clear attribute' : 'Delete attribute';

        return (
          <div key={item.key || `empty-${index}`} className={cls.attributeRow}>
            <div className={cls.keyContainer}>
              <Select
                aria-label="Search attribute key"
                options={getAttributeOptionsForRow(item.key)}
                value={item.key ? [{ id: item.key, label: item.key }] : []}
                onChange={(params) => {
                  const newKey = String(params.value[0]?.id || '');
                  handleKeyChange(index, newKey);
                }}
                placeholder="Select attribute"
                size="compact"
                error={getFieldError(index, 'key')}
                overrides={overrides.keySelect}
                searchable
                clearable={false}
                disabled={isLoading}
                isLoading={isLoading}
              />
            </div>

            <div className={cls.valueContainer}>
              {renderValueInput(item, index)}
            </div>

            <div className={cls.buttonContainer}>
              <Button
                type="button"
                size="mini"
                kind="tertiary"
                shape="circle"
                onClick={() => {
                  handleDeleteAttribute(index);
                }}
                disabled={!showDeleteButton}
                aria-label={deleteButtonLabel}
              >
                <MdDeleteOutline size={16} />
              </Button>
            </div>
          </div>
        );
      })}

      <div className={cls.addButtonContainer}>
        <Button
          type="button"
          size="mini"
          kind="secondary"
          shape="pill"
          onClick={handleAddAttribute}
          disabled={!hasMoreSearchAttributes || !hasCompleteFields}
          startEnhancer={<MdAdd size={16} />}
        >
          {addButtonText}
        </Button>
      </div>
    </div>
  );
}
