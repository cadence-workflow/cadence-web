import { useMemo, useRef } from 'react';

import { FormControl } from 'baseui/form-control';
import { mergeOverrides } from 'baseui/helpers/overrides';
import {
  type ImperativeMethods,
  Select,
  type SelectOverrides,
} from 'baseui/select';

import { overrides } from './multi-select-filter.styles';
import { type Props } from './multi-select-filter.types';
import MultiSelectMenu from './multi-select-menu/multi-select-menu';
import {
  type MultiSelectMenuOption,
  type Props as MenuProps,
} from './multi-select-menu/multi-select-menu.types';

export default function MultiSelectFilter<T extends string>({
  label,
  placeholder,
  values,
  onChangeValues,
  optionsLabelMap,
}: Props<T>) {
  const selectValue = useMemo(
    () => values.map((v) => ({ id: v, label: optionsLabelMap[v] })),
    [values, optionsLabelMap]
  );

  const options = useMemo(
    () =>
      Object.entries<string>(optionsLabelMap).map(
        ([id, label]) =>
          ({
            id,
            label,
          }) as MultiSelectMenuOption<T>
      ),
    [optionsLabelMap]
  );

  const controlRef = useRef<ImperativeMethods>(null);

  return (
    <FormControl label={label} overrides={overrides.selectFormControl}>
      <Select
        controlRef={controlRef}
        multi
        size="compact"
        value={selectValue}
        options={options}
        onChange={(params) =>
          onChangeValues(params.value.map((v) => v.id as T))
        }
        overrides={mergeOverrides(
          {
            Dropdown: {
              component: MultiSelectMenu,
              props: {
                values,
                options,
                onChangeValues,
                onCloseMenu: () =>
                  controlRef.current &&
                  controlRef.current.setDropdownOpen(false),
              } satisfies MenuProps<T>,
            },
          } satisfies SelectOverrides,
          overrides.select
        )}
        placeholder={placeholder}
      />
    </FormControl>
  );
}
