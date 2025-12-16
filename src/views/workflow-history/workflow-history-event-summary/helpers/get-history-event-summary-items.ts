import { createElement, type ComponentType } from 'react';

import workflowHistoryEventSummaryFieldParsersConfig from '../../config/workflow-history-event-summary-field-parsers.config';
import generateHistoryEventDetails from '../../workflow-history-event-details/helpers/generate-history-event-details';
import {
  type EventSummaryValueComponentProps,
  type WorkflowHistoryEventSummaryItem,
} from '../workflow-history-event-summary.types';

export default function getHistoryEventSummaryItems({
  details,
  summaryFields,
}: {
  details: object;
  summaryFields: Array<string>;
}): Array<WorkflowHistoryEventSummaryItem> {
  // TODO @adhitya.mamallan - see if details computation can be moved up the component tree
  const historyEventDetails = generateHistoryEventDetails({
    details,
  });

  const unsortedSummaryItems = historyEventDetails.reduce<
    Array<WorkflowHistoryEventSummaryItem>
  >((acc, detailsConfig) => {
    if (detailsConfig.isGroup) return acc;

    const { key, path, value, renderConfig } = detailsConfig;
    if (!summaryFields.includes(path)) return acc;

    const summaryFieldParserConfig =
      workflowHistoryEventSummaryFieldParsersConfig.find((config) =>
        config.matcher(path, value)
      );

    let renderValue: ComponentType<EventSummaryValueComponentProps>;
    if (summaryFieldParserConfig?.shouldHide?.(path, value)) {
      return acc;
    } else if (summaryFieldParserConfig?.customRenderValue) {
      renderValue = summaryFieldParserConfig.customRenderValue;
    } else if (renderConfig?.valueComponent) {
      const detailsRenderValue = renderConfig?.valueComponent;
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

    let tooltipLabel = path;
    if (summaryFieldParserConfig?.tooltipLabel) {
      tooltipLabel = summaryFieldParserConfig.tooltipLabel;
    } else if (renderConfig?.getLabel)
      tooltipLabel = renderConfig.getLabel({ key, path, value });

    acc.push({
      path,
      label: tooltipLabel,
      value,
      icon: summaryFieldParserConfig?.icon ?? null,
      renderValue,
      hideDefaultTooltip: summaryFieldParserConfig?.hideDefaultTooltip,
    });

    return acc;
  }, []);

  return unsortedSummaryItems.sort(
    (a, b) => summaryFields.indexOf(a.path) - summaryFields.indexOf(b.path)
  );
}
