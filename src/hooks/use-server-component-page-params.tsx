import type {
  ParsedQuery,
  PageQueryParams,
} from './use-page-query-params/use-page-query-params.types';
import getPageQueryParamsValues from './use-page-query-params/helpers/get-page-query-params-values';

export function useServerComponentQueryParams<P extends PageQueryParams>(
  config: P,
  searchQueryParams: ParsedQuery<string>
) {
  return getPageQueryParamsValues(config, searchQueryParams);
}
