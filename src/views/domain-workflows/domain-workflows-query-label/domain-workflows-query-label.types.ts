export type ExampleQuery = {
  label: string;
  text: string;
};

export type DomainWorkflowsQueryTooltipConfig = {
  title: string;
  subtitle: string;
  supportedOperators: Array<string>;
  docsCta: string;
  exampleQueriesTitle: string;
  exampleQueries: Array<ExampleQuery>;
  docsButtonText: string;
  docsLink: string;
};
