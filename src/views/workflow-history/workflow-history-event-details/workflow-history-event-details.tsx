'use client';
import React, { useMemo } from 'react';

import useStyletronClasses from '@/hooks/use-styletron-classes';
import formatWorkflowHistoryEvent from '@/utils/data-formatters/format-workflow-history-event';

import generateHistoryEventDetails from './helpers/generate-history-event-details';
import { cssStyles, styled } from './workflow-history-event-details.styles';
import type {
  WorkflowHistoryEventDetailsEntry,
  Props,
} from './workflow-history-event-details.types';

export default function WorkflowHistoryEventDetails({
  event,
  decodedPageUrlParams,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);

  const detailsEntries: WorkflowHistoryEventDetailsEntry[] = useMemo(() => {
    const result = formatWorkflowHistoryEvent(event);
    if (!result) return [];
    return generateHistoryEventDetails(result);
  }, [event]);

  if (!detailsEntries?.length)
    return <div className={cls.emptyDetails}>No Details</div>;

  return (
    <div>
      {detailsEntries.map((entry, index) => (
        <styled.DetailsRow
          $forceWrap={entry.renderConfig?.forceWrap}
          key={`${entry.key}-${entry.path}-${entry.renderConfig?.name}-${index}`}
        >
          <div className={cls.detailsLabel}>
            {entry.renderConfig?.getLabel
              ? entry.renderConfig.getLabel({
                  key: entry.key,
                  path: entry.path,
                  value: entry.value,
                })
              : entry.path}
          </div>
          <styled.DetailsValue $forceWrap={entry.renderConfig?.forceWrap}>
            {entry.renderConfig?.valueComponent ? (
              <entry.renderConfig.valueComponent
                entryKey={entry.key}
                entryPath={entry.path}
                entryValue={entry.value}
                {...decodedPageUrlParams}
              />
            ) : (
              String(entry.value)
            )}
          </styled.DetailsValue>
        </styled.DetailsRow>
      ))}
    </div>
  );
}
