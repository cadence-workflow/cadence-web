import React, { useCallback, useEffect, useState } from 'react';

import { Button } from 'baseui/button';
import { Input } from 'baseui/input';
import type { RenderInputComponentProps } from 'react-autosuggest';
import Autosuggest from 'react-autosuggest';
import { MdPlayArrow, MdCode, MdRefresh } from 'react-icons/md';

import { getAutocompleteSuggestions } from './helpers/get-autocomplete-suggestions';
import { updateQueryTextWithSuggestion } from './helpers/update-autocomplete-suggestions';
import { styled, overrides } from './workflows-query-input.styles';
import type { Props, Suggestion } from './workflows-query-input.types';

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

  return (
    <styled.QueryForm
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <styled.AutosuggestContainer>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          onSuggestionSelected={(_, data) =>
            updateQueryTextWithSuggestion(data, queryText, setQueryText)
          }
          getSuggestionValue={(suggestion) => suggestion.name}
          renderSuggestion={(suggestion, { isHighlighted }) => {
            const SuggestionComponent = isHighlighted
              ? styled.SuggestionHighlighted
              : styled.Suggestion;
            return (
              <SuggestionComponent>
                <Button
                  kind="tertiary"
                  size="compact"
                  overrides={{
                    ...overrides.suggestionButton,
                    Root: {
                      ...overrides.suggestionButton.Root,
                      props: {
                        $isHighlighted: isHighlighted,
                      },
                    },
                  }}
                  tabIndex={-1}
                >
                  {suggestion.name}
                </Button>
              </SuggestionComponent>
            );
          }}
          renderInputComponent={(inputProps) => {
            const {
              onChange,
              ref,
              max,
              min,
              step,
              ['aria-haspopup']: ariaHaspopup,
              size,
              ...restInputProps
            } = inputProps;
            return (
              <Input
                {...restInputProps}
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
          }}
          inputProps={{
            placeholder: 'Filter workflows using a custom query',
            value: queryText,
            onChange: (
              event: React.FormEvent<HTMLElement>,
              { newValue }: { newValue: string }
            ) => {
              setQueryText(newValue);
            },
          }}
        />
      </styled.AutosuggestContainer>
      <Button
        type="submit"
        isLoading={isQueryRunning}
        overrides={overrides.runButton}
      >
        {isQueryUnchanged ? 'Rerun Query' : 'Run Query'}
      </Button>
    </styled.QueryForm>
  );
}
