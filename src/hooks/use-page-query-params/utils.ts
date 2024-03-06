import type { PageQueryParamConfig, QueryParamsSetterObject, QueryParamsValues, ParsedQuery } from "./types";

/**
 * @param {QueryParamSetterValue} val
 * @param {boolean} isMultiValue
 * @returns {any[]} arrayfiedVal
 *
 * This function accepts a value for a query param and a flag to indicate if the param is a multivalue param or not
 * The function then returns the value while making sure it is an array value if it is a multivalue param
 * The benifit behind using this function instead of using the value directly is that if you add multiple values for the same query param it would be changed from a single string to an array of strings, in order to avoid check for this case
 * within the whole codebase we just mark the values that we plan to contain multiple values and we return them as arrays even if they had a single value
 */
export const getArrayValForMultiValParams = (val: any, isMultiValue: Boolean) => {
    return isMultiValue && !Array.isArray(val) ? [val] : val;
};

/**
 * @param {PageQueryParamConfig} configs
 * @param {ParsedQuery<string>} urlQueryParamsObject
 * @returns {QueryParamsValues} pageParamsValues
 *
 * This function accepts the configs for query params that a page is intersted in and object of the current url query params
 * It returns only the query params the page is intersted in and process the values by parsing it and assigning default values if needed
 */
export const getPageQueryParamsValues = (
    configs: PageQueryParamConfig[],
    urlQueryParamsObject: ParsedQuery<string>
): QueryParamsValues => {
    return configs.reduce((result, configObject) => {
        const queryParamKey = configObject.queryParamKey || configObject.key;
        const valInUrl = urlQueryParamsObject[queryParamKey];
        const isMultiValue = configObject.isMultiValue || false;
        if (valInUrl === undefined || valInUrl === null) {
            result[configObject.key] = configObject?.defaultValue;
        } else if (typeof configObject.parseValue === 'function') {
            const valToBeParsed = getArrayValForMultiValParams(valInUrl, isMultiValue);
            result[configObject.key] = Array.isArray(valToBeParsed)
                ? valToBeParsed.map(configObject.parseValue)
                : configObject.parseValue(valToBeParsed);
        } else {
            const val = getArrayValForMultiValParams(valInUrl, isMultiValue);
            result[configObject.key] = val;
        }

        return result;
    }, {} as QueryParamsValues);
};

/**
 * @param {PageQueryParamConfig} configs
 * @param {QueryParamsSetterObject} queryParamValuesToUpdateMap
 * @param {string} currentUrlSearch
 * @returns {string} updatedUrlSearchString
 *
 * This function accepts the configs for query params that a page is intersted in, an object of with params keys and values to update and the current url search string which represents the existing params values
 * It returns the new url search string by applying changes from queryParamValuesToUpdateMap to the currentUrlSearch
 */

export const getUpdatedUrlSearch = (
    configs: PageQueryParamConfig[],
    queryParamValuesToUpdateMap: QueryParamsSetterObject,
    currentUrlSearch: string
): string => {
    const searchParamsURL = new URLSearchParams(currentUrlSearch);

    configs.forEach((c) => {
        if (queryParamValuesToUpdateMap && queryParamValuesToUpdateMap.hasOwnProperty(c.key)) {
            const queryParamValue = queryParamValuesToUpdateMap[c.key];
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
