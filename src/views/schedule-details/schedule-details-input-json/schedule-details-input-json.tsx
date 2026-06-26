'use client';
import React, { useMemo } from 'react';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import PrettyJson from '@/components/pretty-json/pretty-json';
import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';
import formatInputPayload from '@/utils/data-formatters/format-input-payload';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import { overrides, styled } from './schedule-details-input-json.styles';
import { type Props } from './schedule-details-input-json.types';

export default function ScheduleDetailsInputJson({ input }: Props) {
  const parsedInput = useMemo(() => formatInputPayload(input), [input]);

  const textToCopy = useMemo(
    () => losslessJsonStringify(parsedInput, null, '\t'),
    [parsedInput]
  );

  return (
    <styled.Container>
      <styled.Header>
        <styled.Title>Input</styled.Title>
        <CopyTextButton
          textToCopy={textToCopy}
          overrides={overrides.copyButton}
        />
      </styled.Header>
      <PrettyJson json={parsedInput as PrettyJsonValue} />
    </styled.Container>
  );
}
