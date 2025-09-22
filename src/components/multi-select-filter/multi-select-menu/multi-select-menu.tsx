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
  const [tempValues, setTempValues] = useState<Array<T>>(values);

  const resetTempValues = useCallback(() => {
    if (values.length > 0) {
      setTempValues(values);
    } else {
      setTempValues([]);
    }
  }, [values]);

  const isUnchanged = useMemo(
    () => isEqual(new Set(values), new Set(tempValues)),
    [values, tempValues]
  );

  useEffect(() => {
    resetTempValues();
  }, [resetTempValues]);

  const onChangeCheckbox = useCallback(
    (id: T, checked: boolean) => {
      let newValue: Array<T> = tempValues;

      if (!checked) {
        newValue = tempValues.filter((v) => v !== id);
      } else if (checked && !tempValues.includes(id)) {
        newValue = tempValues.concat(id);
      }

      setTempValues(newValue);
    },
    [tempValues]
  );

  return (
    <styled.MenuContainer>
      <styled.SelectAllContainer>
        <Checkbox
          checked={tempValues.length === options.length}
          isIndeterminate={
            tempValues.length > 0 && tempValues.length !== options.length
          }
          onChange={(e) => {
            if (e.target.checked) {
              setTempValues(options.map(({ id }) => id));
            } else {
              setTempValues([]);
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
                checked={tempValues.includes(id)}
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
          disabled={isUnchanged}
          onClick={() => {
            resetTempValues();
            onCloseMenu();
          }}
        >
          Cancel
        </Button>
        <Button
          kind="primary"
          size="mini"
          disabled={isUnchanged}
          onClick={() => {
            onChangeValues(tempValues);
            onCloseMenu();
          }}
        >
          Apply
        </Button>
      </styled.ActionButtonsContainer>
    </styled.MenuContainer>
  );
}
