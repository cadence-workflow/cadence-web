'use client';
import React from 'react';

import { FormControl } from 'baseui/form-control';
import { Select, SIZE } from 'baseui/select';

import getOptionsFromLabelMap from './helpers/get-options-from-label-map';
import { overrides } from './list-filter.styles';
import { type Props } from './list-filter.types';

export default function ListFilter<T extends string>({
  value,
  onChangeValue,
  labelMap,
  label,
  placeholder,
}: Props<T>) {
  const options = getOptionsFromLabelMap(labelMap);
  const optionValue = options.filter((option) => option.id === value);

  return (
    <FormControl label={label} overrides={overrides.selectFormControl}>
      <Select
        size={SIZE.compact}
        value={optionValue}
        options={options}
        onChange={(params) =>
          onChangeValue(
            options.find((opt) => opt.id === params.value[0]?.id)
              ? (String(params.value[0]?.id) as T)
              : undefined
          )
        }
        placeholder={placeholder}
      />
    </FormControl>
  );
}
