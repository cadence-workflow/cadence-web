import {
  type PageQueryParam,
  type PageQueryParamValues,
} from '@/hooks/use-page-query-params/use-page-query-params.types';

export const mockQueryParamsConfig: [
  PageQueryParam<'mockNameFilter', string>,
  PageQueryParam<'mockShowDeprecated', boolean>,
] = [
  {
    key: 'mockNameFilter',
    queryParamKey: 'mn',
    defaultValue: '',
  },
  {
    key: 'mockShowDeprecated',
    queryParamKey: 'md',
    defaultValue: false,
    parseValue: (value) => value === 'true',
  },
] as const;

export const mockQueryParamsValues = {
  mockNameFilter: '',
  mockShowDeprecated: false,
} as const satisfies PageQueryParamValues<typeof mockQueryParamsConfig>;
