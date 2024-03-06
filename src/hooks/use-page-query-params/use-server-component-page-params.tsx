import type { PageQueryParamConfig, QueryParamsValues, ParsedQuery } from './types';
import { getPageQueryParamsValues } from './utils';

export function useServerComponentQueryParams(
    configs: PageQueryParamConfig[],
    searchQueryParams: ParsedQuery<string>,
): QueryParamsValues {
    return getPageQueryParamsValues(configs, searchQueryParams);
}