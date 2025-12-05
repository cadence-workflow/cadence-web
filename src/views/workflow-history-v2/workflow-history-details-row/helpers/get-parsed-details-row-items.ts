import { createElement, type ComponentType } from 'react';

import workflowHistoryDetailsRowParsersConfig from '../../config/workflow-history-details-row-parsers.config';
import { type EventDetailsEntries } from '../../workflow-history-event-details/workflow-history-event-details.types';
import {
  type DetailsRowValueComponentProps,
  type DetailsRowItem,
} from '../workflow-history-details-row.types';

export default function getParsedDetailsRowItems(
  detailsEntries: EventDetailsEntries
): Array<DetailsRowItem> {
  return detailsEntries.reduce<Array<DetailsRowItem>>((acc, detailsConfig) => {
    if (detailsConfig.isGroup) return acc;

    const { key, path, value, renderConfig } = detailsConfig;

    const parserConfig = workflowHistoryDetailsRowParsersConfig.find((config) =>
      config.matcher(path, value)
    );

    if (parserConfig?.hide?.(path, value)) {
      return acc;
    }

    const label = renderConfig?.getLabel?.({ key, path, value }) ?? path;

    let renderValue: ComponentType<DetailsRowValueComponentProps>;
    if (parserConfig?.customRenderValue) {
      renderValue = parserConfig.customRenderValue;
    } else if (renderConfig?.valueComponent) {
      const detailsRenderValue = renderConfig.valueComponent;
      renderValue = ({ value, label, isNegative, ...workflowPageParams }) =>
        createElement(detailsRenderValue, {
          entryKey: key,
          entryPath: path,
          entryValue: value,
          isNegative,
          ...workflowPageParams,
        });
    } else {
      renderValue = ({ value }) => String(value);
    }

    acc.push({
      path,
      label,
      value,
      icon: parserConfig?.icon ?? null,
      renderValue,
      renderTooltip: parserConfig?.customTooltipContent ?? (() => label),
      invertTooltipColors: parserConfig?.invertTooltipColors,
      omitWrapping: parserConfig?.omitWrapping,
    });

    return acc;
  }, []);
}
