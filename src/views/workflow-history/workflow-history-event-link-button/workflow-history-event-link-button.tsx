import { useState } from 'react';

import { Button } from 'baseui/button';
import { StatefulTooltip } from 'baseui/tooltip';
import copy from 'copy-to-clipboard';
import queryString from 'query-string';
import { MdLink } from 'react-icons/md';

import { overrides } from './workflow-history-event-link-button.styles';
import { type Props } from './workflow-history-event-link-button.types';

export default function WorkflowHistoryEventLinkButton({
  historyEventId,
  isUngroupedView,
}: Props) {
  const [isEventLinkCopied, setIsEventLinkCopied] = useState(false);

  return (
    <StatefulTooltip
      showArrow
      placement="right"
      popoverMargin={8}
      accessibilityType="tooltip"
      content={() =>
        isEventLinkCopied ? 'Copied link to event' : 'Copy link to event'
      }
      onMouseLeave={() => setIsEventLinkCopied(false)}
      returnFocus
      autoFocus
    >
      <Button
        aria-label="Copy link to event"
        size="mini"
        shape="circle"
        kind="tertiary"
        overrides={overrides.copyButton}
        onClick={(e) => {
          e.stopPropagation();
          copy(
            queryString.stringifyUrl({
              url: window.location.origin + window.location.pathname,
              query: {
                he: historyEventId,
                u: isUngroupedView ? 'true' : undefined,
              },
            })
          );
          setIsEventLinkCopied(true);
        }}
      >
        <MdLink />
      </Button>
    </StatefulTooltip>
  );
}
