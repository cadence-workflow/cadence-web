import { type PageQueryParam } from '@/hooks/use-page-query-params/use-page-query-params.types';
import { type SortOrder } from '@/utils/sort-by';

const domainsPageQueryParamsConfig: [
  PageQueryParam<'searchText', string>,
  PageQueryParam<'clusterName', string | undefined>,
  PageQueryParam<'sortColumn', string | undefined>,
  PageQueryParam<'sortOrder', SortOrder | undefined>,
  PageQueryParam<'showDeprecated', boolean>,
] = [
  {
    key: 'searchText',
    queryParamKey: 's',
    defaultValue: '',
  },
  {
    key: 'clusterName',
    queryParamKey: 'c',
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
  {
    key: 'showDeprecated',
    queryParamKey: 'd',
    defaultValue: false,
    parseValue: (value) => value === 'true',
  },
] as const;

export default domainsPageQueryParamsConfig;
