import { PageQueryParam } from '@/hooks/use-page-query-params/use-page-query-params.types';
import { SortingOrder } from '@/components/table/table.types';

const domainsPageQueryParamsConfig: [
  PageQueryParam<'searchText', string>,
  PageQueryParam<'clusterName', string>,
  PageQueryParam<'sortColumn', string>,
  PageQueryParam<'sortOrder', SortingOrder>,
] = [
  {
    key: 'searchText',
    queryParamKey: 's',
    defaultValue: '',
  },
  {
    key: 'clusterName',
    queryParamKey: 'c',
    defaultValue: '',
  },
  {
    key: 'sortColumn',
    queryParamKey: 'sc',
  },
  {
    key: 'sortOrder',
    queryParamKey: 'so',
  },
] as const;

export default domainsPageQueryParamsConfig;
