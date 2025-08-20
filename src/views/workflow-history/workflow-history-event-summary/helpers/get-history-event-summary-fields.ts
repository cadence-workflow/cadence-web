import { createElement, type ComponentType } from 'react';

import workflowHistoryEventSummaryFieldParsersConfig from '../../config/workflow-history-event-summary-field-parsers.config';
import generateHistoryEventDetails from '../../workflow-history-event-details/helpers/generate-history-event-details';
import {
  type EventSummaryValueComponentProps,
  type WorkflowHistoryEventSummaryField,
} from '../workflow-history-event-summary.types';

export default function getHistoryEventSummaryFields({
  details,
  summaryFields,
}: {
  details: object;
  summaryFields: Array<string>;
}): Array<WorkflowHistoryEventSummaryField> {
  const historyEventDetails = generateHistoryEventDetails({
    details,
  });

  return historyEventDetails.reduce<Array<WorkflowHistoryEventSummaryField>>(
    (acc, detailsConfig) => {
      if (detailsConfig.isGroup) return acc;

      const { key, path, value, renderConfig } = detailsConfig;
      if (!summaryFields.includes(path)) return acc;

      const summaryFieldParserConfig =
        workflowHistoryEventSummaryFieldParsersConfig.find((config) =>
          config.matcher(path, value)
        );

      let renderValue: ComponentType<EventSummaryValueComponentProps>;
      if (summaryFieldParserConfig?.customRenderValue) {
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

      acc.push({
        path,
        label: renderConfig?.getLabel?.({ key, path, value }) ?? path,
        value,
        icon: summaryFieldParserConfig?.icon ?? null,
        renderValue,
        hideDefaultTooltip: summaryFieldParserConfig?.hideDefaultTooltip,
      });

      return acc;
    },
    []
  );
}
