import { PageQueryParam } from '@/hooks/use-page-query-params/use-page-query-params.types';
import { SortingOrder } from '@/components/table/table.types';

const domainsPageQueryParamsConfig: [
  PageQueryParam<'searchText', string>,
  PageQueryParam<'clusterName', string>,
  PageQueryParam<'sortColumn', string | undefined>,
  PageQueryParam<'sortOrder', SortingOrder | undefined>,
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
    parseValue: (value: string) => {
      if (value === 'ASC' || value === 'DESC') {
        return value;
      }
      return undefined;
    },
  },
] as const;

export default domainsPageQueryParamsConfig;
