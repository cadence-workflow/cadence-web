'use client';
import React from 'react';

import { FormControl } from 'baseui/form-control';
import { Select, SIZE } from 'baseui/select';

import getOptionsFromLabelMap from '../list-filter/helpers/get-options-from-label-map';

import { overrides } from './list-filter-multi.styles';
import { type Props } from './list-filter-multi.types';

export default function ListFilterMulti<T extends string>({
  values,
  onChangeValues,
  labelMap,
  label,
  placeholder,
}: Props<T>) {
  const options = getOptionsFromLabelMap(labelMap);
  const optionsValues = values?.map((value) => ({
    id: value,
    label: labelMap[value],
  }));

  return (
    <FormControl label={label} overrides={overrides.selectFormControl}>
      <Select
        multi
        size={SIZE.compact}
        value={optionsValues}
        options={options}
        onChange={(params) =>
          onChangeValues(
            params.value.length > 0
              ? params.value.map((v) => v.id as T)
              : undefined
          )
        }
        placeholder={placeholder}
      />
    </FormControl>
  );
}
