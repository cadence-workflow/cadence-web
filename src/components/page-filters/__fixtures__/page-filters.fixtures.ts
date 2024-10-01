import type { PageQueryParam } from '@/hooks/use-page-query-params/use-page-query-params.types';

import { type PageFilterConfig } from '../page-filters.types';

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

export const mockFiltersConfig: [
  PageFilterConfig<typeof mockPageQueryParamConfig, { paramA: string }>,
  PageFilterConfig<typeof mockPageQueryParamConfig, { paramB: string }>,
] = [
  {
    id: 'filterA',
    getValue: (v) => ({ paramA: v.paramA }),
    formatValue: (v) => v,
    component: () => 'FilterA',
  },
  {
    id: 'filterB',
    getValue: (v) => ({ paramB: v.paramB }),
    formatValue: (v) => v,
    component: () => 'FilterB',
  },
];
