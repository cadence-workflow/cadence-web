'use client';
import React, { useMemo } from 'react';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import PrettyJson from '@/components/pretty-json/pretty-json';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import { styled, overrides } from './workflow-diagnostics-metadata-json.styles';
import type { Props } from './workflow-diagnostics-metadata-json.types';

// This component is currently adapted from the WorkflowHistoryEventDetailsJson viewer.
// TODO: Create a shared JSON viewer component to handle the different JSON display requirements throughout the codebase.
export default function WorkflowDiagnosticsMetadataJson({ value }: Props) {
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
