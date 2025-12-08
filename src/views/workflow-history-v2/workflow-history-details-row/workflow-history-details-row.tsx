import React, { useMemo } from 'react';

import { StatefulTooltip } from 'baseui/tooltip';

import getParsedDetailsRowItems from './helpers/get-parsed-details-row-items';
import { overrides, styled } from './workflow-history-details-row.styles';
import { type Props } from './workflow-history-details-row.types';

export default function WorkflowHistoryDetailsRow({
  detailsEntries,
  ...workflowPageParams
}: Props) {
  const rowItems = useMemo(() => {
    if (detailsEntries.length === 0) {
      return [];
    }

    return getParsedDetailsRowItems(detailsEntries);
  }, [detailsEntries]);

  const negativePathsSet = useMemo(
    () =>
      new Set(
        detailsEntries
          .filter((entry) => entry.isNegative)
          .map((entry) => entry.path)
      ),
    [detailsEntries]
  );

  if (rowItems.length === 0) return <div />;

  return (
    <styled.DetailsRowContainer>
      {rowItems.map((item) => {
        const isNegative = negativePathsSet.has(item.path);

        return (
          <StatefulTooltip
            key={item.path}
            content={
              <item.renderTooltip
                label={item.label}
                value={item.value}
                isNegative={isNegative}
                {...workflowPageParams}
              />
            }
            ignoreBoundary
            placement="bottom"
            showArrow
            overrides={
              item.invertTooltipColors
                ? overrides.popoverInverted
                : overrides.popover
            }
          >
            <styled.DetailsFieldContainer
              $isNegative={isNegative}
              $omitWrapping={item.omitWrapping ?? false}
            >
              {item.icon && <item.icon size={12} />}
              <item.renderValue
                label={item.label}
                value={item.value}
                isNegative={isNegative}
                {...workflowPageParams}
              />
            </styled.DetailsFieldContainer>
          </StatefulTooltip>
        );
      })}
    </styled.DetailsRowContainer>
  );
}
