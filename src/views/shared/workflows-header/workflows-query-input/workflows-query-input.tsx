import React, { useCallback, useEffect, useState } from 'react';

import { Button } from 'baseui/button';
import { Input } from 'baseui/input';
import type { RenderInputComponentProps } from 'react-autosuggest';
import Autosuggest from 'react-autosuggest';
import { MdPlayArrow, MdCode, MdRefresh } from 'react-icons/md';

import {
  getAutocompleteSuggestions,
  onSuggestionSelected,
} from './helpers/get-autocomplete-suggestions';
import {
  styled,
  overrides,
  autosuggestStyles,
} from './workflows-query-input.styles';
import type { Props, Suggestion } from './workflows-query-input.types';

const renderSuggestion = (
  suggestion: Suggestion,
  { isHighlighted }: { isHighlighted: boolean }
) => (
  <Button
    kind="tertiary"
    size="compact"
    overrides={{
      Root: {
        style: ({ $theme }: any) => ({
          width: '100%',
          justifyContent: 'flex-start',
          backgroundColor: isHighlighted
            ? $theme.colors.buttonTertiaryHover
            : 'transparent',
        }),
      },
    }}
    tabIndex={-1}
    // Prevents button from being focusable by tab, as Autosuggest manages focus
  >
    {suggestion.name}
  </Button>
);

export default function WorkflowsQueryInput({
  value,
  setValue,
  refetchQuery,
  isQueryRunning,
}: Props) {
  const [queryText, setQueryText] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    setQueryText(value);
  }, [value]);

  const isQueryUnchanged = value && value === queryText;

  const onSubmit = useCallback(() => {
    if (!isQueryUnchanged) {
      setValue(queryText || undefined);
    } else {
      refetchQuery();
    }
  }, [isQueryUnchanged, setValue, queryText, refetchQuery]);

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getAutocompleteSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const renderInputComponent = (inputProps: RenderInputComponentProps) => {
    const inputPropsCleaned = Object.entries(inputProps).reduce(
      (acc, [key, value]) => {
        if (
          key === 'ref' ||
          key === 'onChange' ||
          key === 'max' ||
          key === 'min' ||
          key === 'step'
        ) {
          return acc; // skip these
        }
        if (key === 'aria-haspopup') {
          if (typeof value === 'string') {
            acc[key] = value;
          }
          return acc;
        }
        acc[key] = value;
        return acc;
      },
      {} as Record<string, unknown>
    );
    const { onChange } = inputProps;
    return (
      <Input
        {...inputPropsCleaned}
        onChange={(e) => {
          if (onChange) {
            (
              onChange as (
                event: React.FormEvent<HTMLElement>,
                params: { newValue: string }
              ) => void
            )(e as unknown as React.FormEvent<HTMLElement>, {
              newValue: (e.target as HTMLInputElement).value,
            });
          }
        }}
        startEnhancer={() => <MdCode />}
        overrides={overrides.input}
        clearable
        clearOnEscape
      />
    );
  };

  const inputProps = {
    placeholder: 'Filter workflows using a custom query',
    value: queryText,
    onChange: (
      event: React.FormEvent<HTMLElement>,
      { newValue }: { newValue: string }
    ) => {
      setQueryText(newValue);
    },
  };

  return (
    <styled.QueryForm
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={(_, data) =>
          onSuggestionSelected(data, queryText, setQueryText)
        }
        getSuggestionValue={(suggestion) => suggestion.name}
        renderSuggestion={renderSuggestion}
        renderInputComponent={renderInputComponent}
        inputProps={inputProps}
        theme={autosuggestStyles}
      />
      <Button
        type="submit"
        onClick={onSubmit}
        isLoading={isQueryRunning}
        startEnhancer={() => {
          if (isQueryRunning) return null;
          if (isQueryUnchanged) return <MdRefresh />;
          return <MdPlayArrow />;
        }}
        overrides={overrides.runButton}
      >
        {isQueryUnchanged ? 'Rerun Query' : 'Run Query'}
      </Button>
    </styled.QueryForm>
  );
}
