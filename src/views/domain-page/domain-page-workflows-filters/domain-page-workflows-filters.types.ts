import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';

import type domainPageQueryParamsConfig from '../config/domain-page-query-params.config';

export type DomainPageWorkflowsFiltersConfig = Array<
  PageFilterConfig<typeof domainPageQueryParamsConfig>
>;
