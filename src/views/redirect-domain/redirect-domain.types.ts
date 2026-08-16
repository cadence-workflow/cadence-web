import { type Domain } from '@/__generated__/proto-ts/uber/cadence/api/v1/Domain';

export type RouteParams = {
  domainParams: Array<string>;
};

export type Props = {
  params: RouteParams;
  searchParams?: { [key: string]: string | string[] | undefined };
};

export type DescribeDomainAcrossClustersResult = {
  domains: Domain[];
  hasPermissionDenied: boolean;
  unexpectedError: Error | null;
};
