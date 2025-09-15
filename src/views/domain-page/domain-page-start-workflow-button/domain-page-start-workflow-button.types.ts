import type { DomainPageTabsParams } from '../domain-page-tabs/domain-page-tabs.types';

export type DomainPageStartWorkflowButtonProps = Pick<
  DomainPageTabsParams,
  'domain' | 'cluster'
>;
