'use client';
import React, { useMemo } from 'react';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import PrettyJson from '@/components/pretty-json/pretty-json';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import {
  cssStyles,
  overrides,
} from './workflow-history-event-details-json.styles';
import type { Props } from './workflow-history-event-details-json.types';

export default function WorkflowHistoryEventDetailsJson({ entryValue }: Props) {
  const { cls } = useStyletronClasses(cssStyles);

  const textToCopy = useMemo(() => {
    return losslessJsonStringify(entryValue, null, '\t');
  }, [entryValue]);
  return (
    <div className={cls.jsonViewWrapper}>
      <div className={cls.jsonViewContainer}>
        <div className={cls.jsonViewHeader}>
          <CopyTextButton
            textToCopy={textToCopy}
            overrides={overrides.copyButton}
          />
        </div>
        <PrettyJson json={entryValue} />
      </div>
    </div>
  );
}
