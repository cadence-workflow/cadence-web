'use client';
import React, { useMemo } from 'react';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import PrettyJson from '@/components/pretty-json/pretty-json';
import type { PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';
import formatPayload from '@/utils/data-formatters/format-payload';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import { overrides, styled } from './schedule-details-memo.styles';
import { type Props } from './schedule-details-memo.types';

export default function ScheduleDetailsMemo({ memo }: Props) {
  const formattedMemo = useMemo(() => {
    if (!memo?.fields) {
      return null;
    }

    const entries = Object.entries(memo.fields).flatMap(([key, payload]) => {
      const value = formatPayload(payload);
      if (value === null || value === undefined) {
        return [];
      }

      return [[key, value] as const];
    });

    if (entries.length === 0) {
      return null;
    }

    return Object.fromEntries(entries) as PrettyJsonValue;
  }, [memo]);

  const textToCopy = useMemo(() => {
    if (!formattedMemo) {
      return '';
    }

    return losslessJsonStringify(formattedMemo, null, '\t');
  }, [formattedMemo]);

  if (!formattedMemo) {
    return null;
  }

  return (
    <styled.JsonViewWrapper>
      <styled.JsonViewContainer $isNegative={false}>
        <styled.JsonViewHeader>
          <CopyTextButton
            textToCopy={textToCopy}
            overrides={overrides.copyButton}
          />
        </styled.JsonViewHeader>
        <PrettyJson json={formattedMemo} />
      </styled.JsonViewContainer>
    </styled.JsonViewWrapper>
  );
}
