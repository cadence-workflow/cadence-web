import React from 'react';

import WorkflowHistoryEventDetailsEntry from '../workflow-history-event-details-entry/workflow-history-event-details-entry';

import getDetailsFieldLabel from './helpers/get-details-field-label';
import { styled } from './workflow-history-event-details-group.styles';
import {
  type EventDetailsLabelKind,
  type Props,
} from './workflow-history-event-details-group.types';

export default function WorkflowHistoryEventDetailsGroup({
  entries,
  parentGroupPath = '',
  decodedPageUrlParams,
}: Props) {
  return (
    <>
      {entries.map((entry, index) => {
        const forceWrap = entry.isGroup || entry.renderConfig?.forceWrap;

        let labelKind: EventDetailsLabelKind = 'regular';
        if (entry.isGroup) {
          labelKind = 'group';
        } else if (entry.isNegative) {
          labelKind = 'negative';
        }

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
            <styled.DetailsLabel $forceWrap={forceWrap} $labelKind={labelKind}>
              {getDetailsFieldLabel(entry, parentGroupPath)}
            </styled.DetailsLabel>
            <styled.DetailsValue
              $forceWrap={forceWrap}
              $isNegative={entry.isNegative}
            >
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
                  isNegative={entry.isNegative}
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
