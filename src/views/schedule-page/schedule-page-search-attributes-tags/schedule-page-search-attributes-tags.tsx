'use client';
import React from 'react';

import { mergeOverrides } from 'baseui/helpers/overrides';
import { Tag } from 'baseui/tag';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import { cssStyles, overrides } from './schedule-page-search-attributes-tags.styles';
import { type Props } from './schedule-page-search-attributes-tags.types';

export default function SchedulePageSearchAttributesTags({
  indexedFields,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const keys = Object.keys(indexedFields);

  if (keys.length === 0) {
    return null;
  }

  return (
    <div className={cls.container}>
      {keys.map((key) => (
        <Tag
          key={key}
          closeable={false}
          kind="neutral"
          overrides={mergeOverrides(overrides.tag, {})}
        >
          {key}
        </Tag>
      ))}
    </div>
  );
}
