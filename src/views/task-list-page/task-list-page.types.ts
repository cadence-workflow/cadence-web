export type Props = {
  params: RouteParams;
};

export type RouteParams = {
  domain: string;
  cluster: string;
  taskListName: string;
};
