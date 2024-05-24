import type { PageQueryParam } from '@/hooks/use-page-query-params/use-page-query-params.types';

const defaultParamA = 'valueA1';
const defaultParamB = 'valueB1';

export const mockPageQueryParamConfig: [
  PageQueryParam<'search', string>,
  PageQueryParam<'paramA', string>,
  PageQueryParam<'paramB', string>,
] = [
  {
    key: 'search',
    defaultValue: '',
  },
  { key: 'paramA', defaultValue: defaultParamA },
  { key: 'paramB', defaultValue: defaultParamB },
] as const;

export const mockQueryParamsValues = {
  search: '',
  paramA: defaultParamA,
  paramB: defaultParamB,
};
