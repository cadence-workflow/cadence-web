import React, { useEffect, useState } from 'react';

import { Button } from 'baseui/button';
import { Input } from 'baseui/input';
import { MdPlayArrow, MdCode, MdRefresh } from 'react-icons/md';

import { overrides } from './domain-workflows-query-input.styles';
import { type Props } from './domain-workflows-query-input.types';

export default function DomainWorkflowsQueryInput({ value, setValue }: Props) {
  const [queryText, setQueryText] = useState<string>('');

  useEffect(() => {
    setQueryText(value);
  }, [value]);

  const isQueryUnchanged = value && value === queryText;

  return (
    <>
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
        onClick={() => setValue(queryText || undefined)}
        overrides={overrides.runButton}
        startEnhancer={isQueryUnchanged ? <MdRefresh /> : <MdPlayArrow />}
      >
        {isQueryUnchanged ? 'Rerun Query' : 'Run Query'}
      </Button>
    </>
  );
}
