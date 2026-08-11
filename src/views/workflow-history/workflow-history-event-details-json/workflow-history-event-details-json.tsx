'use client';
import React, { useMemo } from 'react';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import PrettyJson from '@/components/pretty-json/pretty-json';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import {
  styled,
  overrides,
} from './workflow-history-event-details-json.styles';
import type { Props } from './workflow-history-event-details-json.types';

export default function WorkflowHistoryEventDetailsJson({
  entryValue,
  isNegative,
}: Props) {
  const textToCopy = useMemo(() => {
    return losslessJsonStringify(entryValue, null, '\t');
  }, [entryValue]);

  return (
    <styled.JsonViewWrapper>
      <styled.JsonViewContainer $isNegative={isNegative ?? false}>
        <styled.JsonViewHeader>
          <CopyTextButton
            textToCopy={textToCopy}
            overrides={overrides.copyButton}
          />
        </styled.JsonViewHeader>
        <PrettyJson json={entryValue} />
      </styled.JsonViewContainer>
    </styled.JsonViewWrapper>
  );
}
