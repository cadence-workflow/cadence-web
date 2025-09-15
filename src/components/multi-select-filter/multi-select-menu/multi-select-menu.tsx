import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from 'baseui/button';
import { Checkbox } from 'baseui/checkbox';
import { isEqual } from 'lodash';

import { overrides, styled } from './multi-select-menu.styles';
import { type Props } from './multi-select-menu.types';

export default function MultiSelectMenu<T extends string>({
  values,
  options,
  onChangeValues,
  onCloseMenu,
}: Props<T>) {
  const [tempValue, setTempValue] = useState<Array<T>>(values);

  const resetTempValue = useCallback(() => {
    if (values.length > 0) {
      setTempValue(values);
    } else {
      setTempValue([]);
    }
  }, [values]);

  const isValueUnsaved = useMemo(
    () => isEqual(values.toSorted(), tempValue.toSorted()),
    [values, tempValue]
  );

  useEffect(() => {
    resetTempValue();
  }, [resetTempValue]);

  const onChangeCheckbox = useCallback(
    (id: T, checked: boolean) => {
      let newValue: Array<T> = tempValue;

      if (!checked) {
        newValue = tempValue.filter((v) => v !== id);
      } else if (checked && !tempValue.includes(id)) {
        newValue = tempValue.concat(id);
      }

      setTempValue(newValue);
    },
    [tempValue]
  );

  return (
    <styled.MenuContainer>
      <styled.SelectAllContainer>
        <Checkbox
          checked={tempValue.length === options.length}
          isIndeterminate={
            tempValue.length > 0 && tempValue.length !== options.length
          }
          onChange={(e) => {
            if (e.target.checked) {
              setTempValue(options.map(({ id }) => id));
            } else {
              setTempValue([]);
            }
          }}
          labelPlacement="right"
          overrides={overrides.checkbox}
        >
          Select All
        </Checkbox>
      </styled.SelectAllContainer>
      <styled.OptionsContainer>
        {options.map(({ id, label }) => {
          return (
            <Fragment key={id}>
              <Checkbox
                checked={tempValue.includes(id)}
                onChange={(e) => onChangeCheckbox(id, e.target.checked)}
                overrides={overrides.checkbox}
              >
                {label}
              </Checkbox>
            </Fragment>
          );
        })}
      </styled.OptionsContainer>
      <styled.ActionButtonsContainer>
        <Button
          kind="secondary"
          size="mini"
          disabled={isValueUnsaved}
          onClick={() => {
            resetTempValue();
            // onCloseMenu();
          }}
        >
          Cancel
        </Button>
        <Button
          kind="primary"
          size="mini"
          disabled={isValueUnsaved}
          onClick={() => {
            onChangeValues(tempValue);
            onCloseMenu();
          }}
        >
          Apply
        </Button>
      </styled.ActionButtonsContainer>
    </styled.MenuContainer>
  );
}
