'use client';
import React, { useMemo } from 'react';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import PrettyJson from '@/components/pretty-json/pretty-json';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import { overrides, styled } from './pretty-json-viewer.styles';
import type { Props } from './pretty-json-viewer.types';

export default function PrettyJsonViewer({ value, isNegative }: Props) {
  const textToCopy = useMemo(() => {
    return losslessJsonStringify(value, null, '\t');
  }, [value]);
  return (
    <styled.JsonViewWrapper>
      <styled.JsonViewContainer $isNegative={isNegative ?? false}>
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
