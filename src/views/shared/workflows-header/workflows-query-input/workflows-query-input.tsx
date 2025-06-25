import React, { useCallback, useEffect, useState } from 'react';

import { Button } from 'baseui/button';
import { Input } from 'baseui/input';
import * as AutosuggestNS from 'react-autosuggest';
import type { RenderInputComponentProps } from 'react-autosuggest';
import { MdPlayArrow, MdCode, MdRefresh } from 'react-icons/md';

import { autocompletes } from './autocompletes';
import { styled, overrides } from './workflows-query-input.styles';
import { type Props } from './workflows-query-input.types';

const Autosuggest = (AutosuggestNS as any).default || AutosuggestNS;

const attributeNames = autocompletes
  .filter((x) => x.type !== 'OPERATOR' && x.type !== 'STATUS')
  .map((x) => x.name);
const operators = autocompletes
  .filter((x) => x.type === 'OPERATOR')
  .map((x) => x.name);
const statuses = autocompletes
  .filter((x) => x.type === 'STATUS')
  .map((x) => x.name);
const values = autocompletes
  .filter((x) => x.type === 'VALUE')
  .map((x) => x.name);

function getSuggestions(value: string) {
  const tokens = value.trim().split(/\s+/);
  const lastToken = tokens[tokens.length - 1] || '';
  const prevToken = tokens[tokens.length - 2] || '';

  // attribute suggestions at start or after logical operators
  if (
    tokens.length === 1 ||
    ['AND', 'OR', 'IN'].includes(prevToken.toUpperCase())
  ) {
    return attributeNames
      .filter((name) => name.toLowerCase().startsWith(lastToken.toLowerCase()))
      .map((name) => ({ name, type: 'ATTRIBUTE' }));
  }

  const attributeValueMap = {
    CloseStatus: statuses,
    Passed: ['TRUE', 'FALSE'],
    IsCron: ['TRUE', 'FALSE'],
  } as const;

  const timeAttributes = [
    'CloseTime',
    'StartTime',
    'UpdateTime',
    'HistoryLength',
  ];

  const isTimeAttribute = timeAttributes.includes(prevToken);

  // time attribute with comparison operator
  if (
    isTimeAttribute &&
    ['=', '!=', '>', '>=', '<', '<='].some((op) => lastToken.startsWith(op))
  ) {
    return [
      {
        name: '"YYYY-MM-DDTHH:MM:SS±HH:MM"',
        type: 'TIME',
      },
    ];
  } else if (
    isTimeAttribute &&
    ['BETWEEN'].some((op) => lastToken.startsWith(op))
  ) {
    return [
      {
        name: '"YYYY-MM-DDTHH:MM:SS±HH:MM" AND "YYYY-MM-DDTHH:MM:SS±HH:MM"',
        type: 'TIME',
      },
    ];
  }

  const idAttributes = [
    'WorkflowType',
    'WorkflowID',
    'DomainID',
    'RolloutID',
    'RunID',
    'TaskList',
  ];
  const isIdAttribute = idAttributes.includes(prevToken);
  if (isIdAttribute && ['=', '!='].some((op) => lastToken.startsWith(op))) {
    return [
      {
        name: '"<ID>"',
        type: 'ID',
      },
    ];
  }

  type AttributeKey = keyof typeof attributeValueMap;

  // after attribute with or without space
  const attributeMatch = Object.keys(attributeValueMap).find(
    (attr) =>
      (prevToken === attr && (lastToken === '=' || lastToken === '!=')) ||
      new RegExp(`^${attr}(!=|=)$`).test(lastToken)
  ) as AttributeKey | undefined;

  if (attributeMatch) {
    return attributeValueMap[attributeMatch].map((value) => ({
      name: value,
      type: attributeMatch === 'CloseStatus' ? 'STATUS' : 'VALUE',
    }));
  }

  // Suggest logical operators after a complete value
  const lastTokenIsCompleteValue =
    (lastToken.startsWith('"') && lastToken.endsWith('"')) ||
    ['TRUE', 'FALSE'].includes(lastToken.toUpperCase());

  if (lastTokenIsCompleteValue) {
    return [
      { name: 'AND', type: 'OPERATOR' },
      { name: 'OR', type: 'OPERATOR' },
      { name: 'IN', type: 'OPERATOR' },
    ];
  }

  // Default: no suggestions
  return [];
}

const getSuggestionValue = (suggestion: { name: string }) => suggestion.name;

const renderSuggestion = (suggestion: { name: string; type: string }) => (
  <div>
    {suggestion.name} <span style={{ color: '#888' }}></span>
  </div>
);

// Add theme for Autosuggest to mimic baseui Input
const autosuggestTheme = {
  container: {
    flexGrow: 1,
  },
  input: 'baseui-autosuggest-input',
  suggestionsContainer: 'baseui-autosuggest-suggestions-container',
  suggestion: 'baseui-autosuggest-suggestion',
  suggestionHighlighted: 'baseui-autosuggest-suggestion-highlighted',
};

export default function WorkflowsQueryInput({
  value,
  setValue,
  refetchQuery,
  isQueryRunning,
}: Props) {
  const [queryText, setQueryText] = useState<string>('');
  const [suggestions, setSuggestions] = useState<
    { name: string; type: string }[]
  >([]);

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
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (
    event: React.SyntheticEvent,
    { suggestion }: { suggestion: { name: string } }
  ) => {
    // Split current query
    const tokens = queryText.trim().split(/\s+/);
    const lastToken = tokens[tokens.length - 1] || '';

    const operatorsToPreserve = [
      '=',
      '!=',
      '>',
      '>=',
      '<',
      '<=',
      'BETWEEN',
      'AND',
    ];

    // if last token is a complete value to be preserved
    const lastTokenIsCompleteValue =
      (lastToken.startsWith('"') && lastToken.endsWith('"')) ||
      ['TRUE', 'FALSE'].includes(lastToken.toUpperCase());

    // if the last token is operator OR a complete value, append suggestion
    if (
      operatorsToPreserve.includes(lastToken.toUpperCase()) ||
      lastTokenIsCompleteValue
    ) {
      let newValue = tokens.join(' ');
      if (!newValue.endsWith(' ')) {
        newValue += ' ';
      }
      newValue += suggestion.name + ' ';
      setQueryText(newValue);
      return;
    }

    // replace the last token (the partial word)
    tokens.pop();
    let newValue = tokens.join(' ');
    if (newValue) {
      newValue += ' ';
    }
    newValue += suggestion.name + ' ';

    // Only update local state
    setQueryText(newValue);
  };

  const renderInputComponent = (inputProps: RenderInputComponentProps) => {
    const { ref, onChange, ...rest } = inputProps;
    // Convert max, min, step to numbers if strings
    const inputCompatibleProps: Record<string, unknown> = { ...rest };
    ['max', 'min', 'step'].forEach((key) => {
      if (
        key in inputCompatibleProps &&
        typeof inputCompatibleProps[key] === 'string'
      ) {
        const num = Number(inputCompatibleProps[key]);
        if (!isNaN(num)) {
          inputCompatibleProps[key] = num;
        } else {
          delete inputCompatibleProps[key];
        }
      }
    });
    ['max', 'min', 'step'].forEach((key) => {
      if (typeof inputCompatibleProps[key] === 'string') {
        delete inputCompatibleProps[key];
      }
    });
    return (
      <Input
        {...inputCompatibleProps}
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
        onSuggestionSelected={onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderInputComponent={renderInputComponent}
        inputProps={inputProps}
        theme={autosuggestTheme}
      />
      <Button
        type="submit"
        onClick={onSubmit}
        disabled={isQueryRunning}
        startEnhancer={() =>
          isQueryRunning ? null : isQueryUnchanged ? (
            <MdRefresh />
          ) : (
            <MdPlayArrow />
          )
        }
        overrides={overrides.runButton}
      >
        {isQueryRunning
          ? 'Running...'
          : isQueryUnchanged
            ? 'Rerun Query'
            : 'Run Query'}
      </Button>
    </styled.QueryForm>
  );
}
