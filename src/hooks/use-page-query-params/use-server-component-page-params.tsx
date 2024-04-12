import type { ParsedQuery, PageQueryParams } from './types';
import { getPageQueryParamsValues } from './utils';

export function useServerComponentQueryParams<P extends PageQueryParams>(
    config: P,
    searchQueryParams: ParsedQuery<string>,
) {
    return getPageQueryParamsValues(config, searchQueryParams);
}