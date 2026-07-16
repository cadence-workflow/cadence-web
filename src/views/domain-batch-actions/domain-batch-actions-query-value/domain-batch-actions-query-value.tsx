import { StatefulTooltip } from 'baseui/tooltip';

import losslessJsonStringify from '@/utils/lossless-json-stringify';

import { overrides, styled } from './domain-batch-actions-query-value.styles';
import { type Props } from './domain-batch-actions-query-value.types';

// Mirrors the workflow-history-v2 Details column: query rendered as a
// monospace, single-line, ellipsized pill that reveals the full value in a
// tooltip on hover.
export default function DomainBatchActionQueryValue({ query }: Props) {
  const formattedQuery = losslessJsonStringify(query);

  return (
    <StatefulTooltip
      content={<styled.Tooltip>{formattedQuery}</styled.Tooltip>}
      ignoreBoundary
      placement="bottom"
      showArrow
      overrides={overrides.popover}
    >
      <styled.QueryContainer>{formattedQuery}</styled.QueryContainer>
    </StatefulTooltip>
  );
}
