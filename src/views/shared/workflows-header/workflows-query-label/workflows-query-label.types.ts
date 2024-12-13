export type ExampleQuery = {
  label: string;
  text: string;
};

export type WorkflowsQueryTooltipConfig = {
  title: string;
  subtitle: string;
  supportedOperators: Array<string>;
  docsCta: string;
  exampleQueriesTitle: string;
  exampleQueries: Array<ExampleQuery>;
  docsButtonText: string;
  docsLink: string;
};
