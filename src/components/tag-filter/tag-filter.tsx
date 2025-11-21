import { useCallback, useMemo } from 'react';

import { useStyletron } from 'baseui';
import { FormControl } from 'baseui/form-control';

import SelectableTag from './selectable-tag/selectable-tag';
import { overrides, styled } from './tag-filter.styles';
import { type Props } from './tag-filter.types';

export default function TagFilter<T extends string>({
  label,
  values,
  onChangeValues,
  optionsConfig,
  hideShowAll,
}: Props<T>) {
  const [_, theme] = useStyletron();

  const tagKeys = useMemo(
    () => Object.keys(optionsConfig) as Array<T>,
    [optionsConfig]
  );

  const areAllValuesSet = useMemo(
    () => tagKeys.every((key) => values.includes(key)),
    [tagKeys, values]
  );

  const toggleAllValues = useCallback(
    () => onChangeValues(areAllValuesSet ? [] : tagKeys),
    [tagKeys, areAllValuesSet, onChangeValues]
  );

  const onChangeSingleValue = useCallback(
    (value: T) =>
      onChangeValues(
        values.includes(value)
          ? values.filter((v) => v !== value)
          : [...values, value]
      ),
    [values, onChangeValues]
  );

  return (
    <styled.FormControlContainer>
      <FormControl label={label} overrides={overrides.formControl}>
        <styled.TagsContainer>
          {!hideShowAll && (
            <SelectableTag
              value={areAllValuesSet}
              onClick={() => toggleAllValues()}
            >
              Show all
            </SelectableTag>
          )}
          {tagKeys.map((tagKey) => {
            const { label, startEnhancer: StartEnhancer } =
              optionsConfig[tagKey];
            return (
              <SelectableTag
                key={tagKey}
                value={values.includes(tagKey)}
                onClick={() => onChangeSingleValue(tagKey)}
                {...(StartEnhancer
                  ? { startEnhancer: () => <StartEnhancer theme={theme} /> }
                  : {})}
              >
                {label}
              </SelectableTag>
            );
          })}
        </styled.TagsContainer>
      </FormControl>
    </styled.FormControlContainer>
  );
}
