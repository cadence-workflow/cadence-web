'use client';
import React, { useMemo } from 'react';

import useStyletronClasses from '@/hooks/use-styletron-classes';
import formatWorkflowHistoryEvent from '@/utils/data-formatters/format-workflow-history-event';

import generateHistoryEventDetails from './helpers/generate-history-event-details';
import { cssStyles } from './workflow-history-event-details.styles';
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
      {detailsEntries.map((entry) => (
        <div className={cls.detailsRow} key={entry.key}>
          <div className={cls.detailsLabel}>
            {entry.renderConfig?.getLabel
              ? entry.renderConfig.getLabel({
                  key: entry.key,
                  path: entry.path,
                  value: entry.value,
                })
              : entry.path}
          </div>
          <div className={cls.detailsValue}>
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
          </div>
        </div>
      ))}
    </div>
  );
}
