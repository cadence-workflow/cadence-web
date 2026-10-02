export type RouteParams = {
  workflowParams: Array<string>;
};

export type Props = {
  params: RouteParams;
  searchParams?: { [key: string]: string | string[] | undefined };
};
