'use client';
import React, { useMemo } from 'react';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import PrettyJson from '@/components/pretty-json/pretty-json';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import { overrides, styled } from './schedule-details-json-view.styles';
import { type Props } from './schedule-details-json-view.types';

export default function ScheduleDetailsJsonView({
  json,
  title,
  limitHeight,
}: Props) {
  const textToCopy = useMemo(
    () => losslessJsonStringify(json, null, '\t'),
    [json]
  );
  const noTitle = !title;

  return (
    <styled.Root $noTitle={noTitle}>
      <styled.Body $limitHeight={limitHeight}>
        <styled.Header $noTitle={noTitle}>
          {title && <styled.Title>{title}</styled.Title>}
          <CopyTextButton
            textToCopy={textToCopy}
            overrides={overrides.copyButton}
          />
        </styled.Header>
        <PrettyJson json={json} />
      </styled.Body>
    </styled.Root>
  );
}
