/**
 * @param {PageQueryParams} config
 * @param {Partial<PageQueryParamSetterValues<PageQueryParams>>} queryParamValuesToUpdateMap
 * @param {string} currentUrlSearch
 * @returns {string} updatedUrlSearchString
 *
 * This function accepts the config for query params that a page is interested in, an object of with params keys and values to update and the current url search string which represents the existing params values
 * It returns the new url search string by applying changes from queryParamValuesToUpdateMap to the currentUrlSearch
 */

import { PageQueryParamKeys, PageQueryParams, PageQueryParamSetterValues } from "../use-page-query-params.types";

const getUpdatedUrlSearch = <P extends PageQueryParams>(
    config: P,
    queryParamValuesToUpdateMap: Partial<PageQueryParamSetterValues<P>>,
    currentUrlSearch: string
): string => {
    const searchParamsURL = new URLSearchParams(currentUrlSearch);

    config.forEach((c) => {
        if (queryParamValuesToUpdateMap && queryParamValuesToUpdateMap.hasOwnProperty(c.key)) {
            const queryParamValue = queryParamValuesToUpdateMap[c.key as PageQueryParamKeys<P>];
            const queryParamKey = c.queryParamKey || c.key;
            if (queryParamValue === undefined) searchParamsURL.delete(queryParamKey);
            else if (Array.isArray(queryParamValue)) {
                searchParamsURL.delete(queryParamKey);
                queryParamValue.forEach((v) => {
                    searchParamsURL.append(queryParamKey, String(v));
                });
            } else searchParamsURL.set(queryParamKey, String(queryParamValue));
        }
    });

    return searchParamsURL.toString();
};

export default getUpdatedUrlSearch;