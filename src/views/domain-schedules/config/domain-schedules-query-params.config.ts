import { type PageQueryParam } from '@/hooks/use-page-query-params/use-page-query-params.types';

import { type DomainSchedulesStatus } from '../domain-schedules-filters-status/domain-schedules-filters-status.types';
import { isDomainSchedulesStatus } from '../helpers/is-domain-schedules-status';

const domainSchedulesQueryParamsConfig: [
  PageQueryParam<'schedulesSearch', string>,
  PageQueryParam<'schedulesStatus', DomainSchedulesStatus | undefined>,
] = [
  {
    key: 'schedulesSearch',
    queryParamKey: 'schsearch',
    defaultValue: '',
  },
  {
    key: 'schedulesStatus',
    queryParamKey: 'schstatus',
    parseValue: (value: string) =>
      isDomainSchedulesStatus(value) ? value : undefined,
  },
] as const;

export default domainSchedulesQueryParamsConfig;
