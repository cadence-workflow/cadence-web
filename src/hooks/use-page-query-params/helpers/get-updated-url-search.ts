/**
 * @param {PageQueryParams} config
 * @param {Partial<PageQueryParamSetterValues<PageQueryParams>>} queryParamValuesToUpdateMap
 * @param {string} currentUrlSearch
 * @returns {string} updatedUrlSearchString
 *
 * This function accepts the config for query params that a page is interested in, an object of with params keys and values to update and the current url search string which represents the existing params values
 * It returns the new url search string by applying changes from queryParamValuesToUpdateMap to the currentUrlSearch
 */

import {
  type PageQueryParamKeys,
  type PageQueryParams,
  type PageQueryParamSetterValues,
} from '../use-page-query-params.types';

const getUpdatedUrlSearch = <P extends PageQueryParams>(
  config: P,
  queryParamValuesToUpdateMap: Partial<PageQueryParamSetterValues<P>>,
  currentUrlSearch: string
): string => {
  const searchParamsURL = new URLSearchParams(currentUrlSearch);

  config.forEach((c) => {
    if (
      queryParamValuesToUpdateMap &&
      queryParamValuesToUpdateMap.hasOwnProperty(c.key)
    ) {
      const queryParamValue =
        queryParamValuesToUpdateMap[c.key as PageQueryParamKeys<P>];
      const queryParamKey = c.queryParamKey || c.key;
      searchParamsURL.delete(queryParamKey);
      if (c.isMultiValue && Array.isArray(queryParamValue)) {
        (queryParamValue as any[]).forEach((v) => {
          searchParamsURL.append(queryParamKey, String(v));
        });
      } else if (queryParamValue !== undefined)
        searchParamsURL.set(queryParamKey, String(queryParamValue));
    }
  });

  return searchParamsURL.toString();
};

export default getUpdatedUrlSearch;
