import { StatefulTooltip } from 'baseui/tooltip';

import { BATCH_ACTION_QUERY_MAX_DISPLAY_LENGTH } from '../domain-batch-actions.constants';

import { overrides, styled } from './domain-batch-actions-query-value.styles';
import { type Props } from './domain-batch-actions-query-value.types';

// query rendered as a
// monospace, single-line, ellipsized pill that reveals the full value in a
// tooltip on hover.
export default function DomainBatchActionQueryValue({ query }: Props) {
  // Cap the always-rendered pill text; the tooltip still shows the full query.
  const cappedQuery =
    query.length > BATCH_ACTION_QUERY_MAX_DISPLAY_LENGTH
      ? `${query.slice(0, BATCH_ACTION_QUERY_MAX_DISPLAY_LENGTH)}…`
      : query;

  return (
    <StatefulTooltip
      content={<styled.Tooltip>{cappedQuery}</styled.Tooltip>}
      ignoreBoundary
      placement="bottom"
      showArrow
      overrides={overrides.popover}
    >
      <styled.QueryContainer>{cappedQuery}</styled.QueryContainer>
    </StatefulTooltip>
  );
}
