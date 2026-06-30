'use client';
import React, { useMemo } from 'react';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import PrettyJson from '@/components/pretty-json/pretty-json';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import { overrides, styled } from './schedule-details-json-view.styles';
import { type Props } from './schedule-details-json-view.types';

export default function ScheduleDetailsJsonView({ json, title }: Props) {
  const textToCopy = useMemo(
    () => losslessJsonStringify(json, null, '\t'),
    [json]
  );

  if (title) {
    return (
      <styled.PanelContainer>
        <styled.PanelHeader>
          <styled.PanelTitle>{title}</styled.PanelTitle>
          <CopyTextButton
            textToCopy={textToCopy}
            overrides={overrides.copyButton}
          />
        </styled.PanelHeader>
        <PrettyJson json={json} />
      </styled.PanelContainer>
    );
  }

  return (
    <styled.InlineWrapper>
      <styled.InlineContainer>
        <styled.InlineHeader>
          <CopyTextButton
            textToCopy={textToCopy}
            overrides={overrides.copyButton}
          />
        </styled.InlineHeader>
        <PrettyJson json={json} />
      </styled.InlineContainer>
    </styled.InlineWrapper>
  );
}
