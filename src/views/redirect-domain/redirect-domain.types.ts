export type RouteParams = {
  domainParams: Array<string>;
};

export type Props = {
  params: RouteParams;
  searchParams?: { [key: string]: string | string[] | undefined };
};
