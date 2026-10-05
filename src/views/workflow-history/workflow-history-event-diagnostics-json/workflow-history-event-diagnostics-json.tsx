'use client';
import React, { useMemo } from 'react';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import PrettyJson from '@/components/pretty-json/pretty-json';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import {
  styled,
  overrides,
} from './workflow-history-event-diagnostics-json.styles';
import type { Props } from './workflow-history-event-diagnostics-json.types';

export default function WorkflowHistoryEventDiagnosticsJson({ value }: Props) {
  const textToCopy = useMemo(() => {
    return losslessJsonStringify(value, null, '\t');
  }, [value]);

  return (
    <styled.JsonViewWrapper>
      <styled.JsonViewContainer>
        <styled.JsonViewHeader>
          <CopyTextButton
            textToCopy={textToCopy}
            overrides={overrides.copyButton}
          />
        </styled.JsonViewHeader>
        <PrettyJson json={value} />
      </styled.JsonViewContainer>
    </styled.JsonViewWrapper>
  );
}
