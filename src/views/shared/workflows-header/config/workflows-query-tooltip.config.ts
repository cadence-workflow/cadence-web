import { type WorkflowsQueryTooltipConfig } from '../workflows-query-label/workflows-query-label.types';

const workflowsQueryTooltipConfig = {
  title: 'Query for Workflows',
  subtitle: `Queries allow you to perform targeted searches that
  go beyond the capabilities of the search UI. We support the following operators:`,
  supportedOperators: [
    'AND, OR, ()',
    '=, !=, >, >=, <, <=',
    'IN',
    'BETWEEN...AND',
    'ORDER BY',
  ],
  docsCta: 'For more details, check out our documentation linked below.',
  exampleQueriesTitle: 'Example queries',
  exampleQueries: [
    {
      label: 'Query closed workflows with a custom search attribute',
      text: 'CloseStatus = "completed" AND custom_search_attribute = "example_value"',
    },
    {
      label: 'Query for workflows that closed within a given time span',
      text: 'CloseTime BETWEEN "2024-01-01T06:00:00+01:00" AND "2024-01-01T08:00:00+01:00"',
    },
  ],
  docsButtonText: 'Check out the docs',
  docsLink:
    'https://cadenceworkflow.io/docs/concepts/search-workflows/#query-capabilities',
} as const satisfies WorkflowsQueryTooltipConfig;

export default workflowsQueryTooltipConfig;
