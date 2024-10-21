import React from 'react';

import WorkflowHistoryEventDetailsEntry from '../workflow-history-event-details-entry/workflow-history-event-details-entry';

import getDetailsFieldLabel from './helpers/get-details-field-label';
import { styled } from './workflow-history-event-details-group.styles';
import { type Props } from './workflow-history-event-details-group.types';

export default function WorkflowHistoryEventDetailsGroup({
  entries,
  parentGroupPath = '',
  decodedPageUrlParams,
}: Props) {
  return (
    <>
      {entries.map((entry, index) => {
        const forceWrap = entry.isGroup || entry.renderConfig?.forceWrap;

        return (
          <styled.DetailsRow
            data-testid="details-row"
            $forceWrap={forceWrap}
            key={`${entry.key}-${entry.path}-${index}${
              !entry.isGroup && entry.renderConfig
                ? '-' + entry.renderConfig.name
                : ''
            }`}
          >
            <styled.DetailsLabel
              $forceWrap={forceWrap}
              $useBlackText={entry.isGroup}
            >
              {getDetailsFieldLabel(entry, parentGroupPath)}
            </styled.DetailsLabel>
            <styled.DetailsValue $forceWrap={forceWrap}>
              {entry.isGroup ? (
                <styled.IndentedDetails>
                  <WorkflowHistoryEventDetailsGroup
                    entries={entry.groupEntries}
                    parentGroupPath={entry.path}
                    decodedPageUrlParams={decodedPageUrlParams}
                  />
                </styled.IndentedDetails>
              ) : (
                <WorkflowHistoryEventDetailsEntry
                  entryKey={entry.key}
                  entryPath={entry.path}
                  entryValue={entry.value}
                  renderConfig={entry.renderConfig}
                  {...decodedPageUrlParams}
                />
              )}
            </styled.DetailsValue>
          </styled.DetailsRow>
        );
      })}
    </>
  );
}
