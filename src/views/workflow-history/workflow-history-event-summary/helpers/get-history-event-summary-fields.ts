import workflowHistoryEventSummaryParsersConfig from '../../config/workflow-history-event-summary-parsers.config';
import { type WorkflowHistoryEventSummaryField } from '../workflow-history-event-summary.types';

export default function getHistoryEventSummaryFields({
  details,
  summaryFields,
}: {
  details: object;
  summaryFields: Array<string>;
}): Array<WorkflowHistoryEventSummaryField> {
  return Object.entries(details).reduce<
    Array<WorkflowHistoryEventSummaryField>
  >((acc, [key, value]) => {
    if (!summaryFields.includes(key)) return acc;

    const renderConfig = workflowHistoryEventSummaryParsersConfig.find(
      (config) => config.matcher(key, value)
    );

    if (!renderConfig) return acc;

    acc.push({
      name: key,
      value,
      renderConfig,
    });

    return acc;
  }, []);
}
