export type Props = {
  params: RouteParams;
};

export type GenerateMetadataProps = {
  params: Promise<Props['params']>;
};

export type RouteParams = {
  domain: string;
  cluster: string;
  taskListName: string;
};
