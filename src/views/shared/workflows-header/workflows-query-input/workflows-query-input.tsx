import React, { useCallback } from 'react';

import { Button } from 'baseui/button';
import { Combobox } from 'baseui/combobox';
import { MdPlayArrow, MdCode, MdRefresh } from 'react-icons/md';

import useQueryTextWithAutocomplete from './hooks/use-query-text-with-autocomplete';
import { styled, overrides } from './workflows-query-input.styles';
import { type Props } from './workflows-query-input.types';

export default function WorkflowsQueryInput({
  value,
  setValue,
  refetchQuery,
  isQueryRunning,
}: Props) {
  const { queryText, setQueryText, nextSuggestions, onSuggestionSelect } =
    useQueryTextWithAutocomplete({ initialValue: value });

  const isQueryUnchanged = value && value === queryText;

  const onSubmit = useCallback(() => {
    if (!isQueryUnchanged) {
      setValue(queryText || undefined);
    } else {
      refetchQuery();
    }
  }, [isQueryUnchanged, setValue, queryText, refetchQuery]);

  return (
    <styled.QueryForm
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Combobox
        value={queryText}
        options={nextSuggestions}
        mapOptionToString={(option) => option}
        onChange={(value, suggestion) => {
          if (suggestion) {
            onSuggestionSelect(suggestion);
          } else {
            setQueryText(value);
          }
        }}
        overrides={{
          ...overrides.combobox,
          Input: {
            props: {
              overrides: overrides.input,
              startEnhancer: () => <MdCode />,
              placeholder: 'Filter workflows using a custom query',
              clearOnEscape: true,
            },
          },
        }}
        clearable
        // "autocomplete" = true temporarily overwrites the Input content while
        // a selection is being made, which can seem confusing to the end user
        autocomplete={false}
      />
      <Button
        type="submit"
        overrides={overrides.runButton}
        startEnhancer={isQueryUnchanged ? <MdRefresh /> : <MdPlayArrow />}
        isLoading={isQueryRunning}
      >
        {isQueryUnchanged ? 'Rerun Query' : 'Run Query'}
      </Button>
    </styled.QueryForm>
  );
}
