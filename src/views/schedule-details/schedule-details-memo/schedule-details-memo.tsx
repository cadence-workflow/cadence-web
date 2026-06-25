'use client';
import React, { useMemo } from 'react';

import useStyletronClasses from '@/hooks/use-styletron-classes';
import formatPayload from '@/utils/data-formatters/format-payload';

import { cssStyles } from './schedule-details-memo.styles';
import { type Props } from './schedule-details-memo.types';

export default function ScheduleDetailsMemo({ memo }: Props) {
  const { cls } = useStyletronClasses(cssStyles);
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

    return Object.fromEntries(entries);
  }, [memo]);

  if (!formattedMemo) {
    return null;
  }

  return (
    <pre className={cls.pre}>{JSON.stringify(formattedMemo, null, '\t')}</pre>
  );
}
