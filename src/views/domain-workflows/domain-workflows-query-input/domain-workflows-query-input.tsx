import React, { useCallback, useEffect, useState } from 'react';

import { Button } from 'baseui/button';
import { Input } from 'baseui/input';
import { MdPlayArrow, MdCode, MdRefresh } from 'react-icons/md';

import { styled, overrides } from './domain-workflows-query-input.styles';
import { type Props } from './domain-workflows-query-input.types';

export default function DomainWorkflowsQueryInput({
  value,
  setValue,
  refetchQuery,
  isQueryRunning,
}: Props) {
  const [queryText, setQueryText] = useState<string>('');

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

  return (
    <styled.QueryForm
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Input
        value={queryText}
        onChange={(event) => {
          setQueryText(event.target.value);
        }}
        startEnhancer={() => <MdCode />}
        overrides={overrides.input}
        placeholder="Filter workflows using a custom query"
        clearable
        clearOnEscape
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
