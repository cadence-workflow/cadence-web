import { type Domain } from '@/__generated__/proto-ts/uber/cadence/api/v1/Domain';

export type DomainData = Domain;

export type FilteredDomains = {
  filteredDomains: Array<DomainData>;
  totalCount: number;
};
