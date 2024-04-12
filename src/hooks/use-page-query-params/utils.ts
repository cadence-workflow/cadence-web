import type { ParsedQuery, PageQueryParamValues, PageQueryParams, PageQueryParamKeys, PageQueryParamSetterValues, ExtractedPageParamsValuesType } from "./types";

/**
 * @param {string | null | (string | null)[]} val
 * @param {boolean} isMultiValue
 * @returns {string | null | string[]} arrayfiedVal
 *
 * This function accepts a value for a query param and a flag to indicate if the param is a multivalue param or not
 * The function then returns the value while making sure it is an array value if it is a multivalue param
 * The benifit behind using this function instead of using the value directly is that if you add multiple values for the same query param it would be changed from a single string to an array of strings, in order to avoid check for this case
 * within the whole codebase we just mark the values that we plan to contain multiple values and we return them as arrays even if they had a single value
 */
export const getArrayValForMultiValParams = (val: string | null | (string | null)[], isMultiValue: Boolean) => {
    if (isMultiValue) {
        const arr = !Array.isArray(val) ? [val] : val;
        return arr.filter(v => v !== null) as string[]
    }
    return Array.isArray(val) ? val[0] : val;
};

/**
 * @param {PageQueryParams} config
 * @param {ParsedQuery<string>} urlQueryParamsObject
 * @returns {PageQueryParamValues<P>}
 *
 * This function accepts the config for query params that a page is intersted in and object of the current url query params
 * It returns only the query params the page is intersted in and process the values by parsing it and assigning default values if needed
 */
export const getPageQueryParamsValues = <P extends PageQueryParams>(
    config: P,
    urlQueryParamsObject: ParsedQuery<string>
): PageQueryParamValues<P> => {
    return config.reduce((result, configObject) => {
        const queryParamKey = configObject.queryParamKey || configObject.key;
        const valInUrl = urlQueryParamsObject[queryParamKey];
        const isMultiValue = configObject.isMultiValue || false;
        const val = getArrayValForMultiValParams(valInUrl, isMultiValue);
        const configKey: PageQueryParamKeys<P> = configObject.key;

        if (val === null || (isMultiValue && val.length === 0)) {
            result[configKey] = configObject?.defaultValue;
        } else if (isMultiValue && typeof configObject.parseValue === 'function') {
            result[configKey] = Array.isArray(val)
                ? val.map(configObject.parseValue)
                : configObject.parseValue(val);
        } else {
            result[configKey] = val as ExtractedPageParamsValuesType<typeof configKey, P>;
        }

        return result;
    }, {} as PageQueryParamValues<P>);
};

/**
 * @param {PageQueryParams} config
 * @param {Partial<PageQueryParamSetterValues<PageQueryParams>>} queryParamValuesToUpdateMap
 * @param {string} currentUrlSearch
 * @returns {string} updatedUrlSearchString
 *
 * This function accepts the config for query params that a page is intersted in, an object of with params keys and values to update and the current url search string which represents the existing params values
 * It returns the new url search string by applying changes from queryParamValuesToUpdateMap to the currentUrlSearch
 */

export const getUpdatedUrlSearch = <P extends PageQueryParams>(
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
