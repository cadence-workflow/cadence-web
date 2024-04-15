import { ExtractedPageParamsValuesType, PageQueryParamKeys, PageQueryParams, PageQueryParamValues, ParsedQuery } from "../use-page-query-params.types";
import getArrayValForMultiValParams from "./get-array-val-for-multi-val-params";

/**
 * @param {PageQueryParams} config
 * @param {ParsedQuery<string>} urlQueryParamsObject
 * @returns {PageQueryParamValues<P>}
 *
 * This function accepts the config for query params that a page is interested in and object of the current url query params
 * It returns only the query params the page is interested in and process the values by parsing it and assigning default values if needed
 */
const getPageQueryParamsValues = <P extends PageQueryParams>(
    config: P,
    urlQueryParamsObject: ParsedQuery<string>
): PageQueryParamValues<P> => {
    return config.reduce((result, configObject) => {
        const queryParamKey = configObject.queryParamKey || configObject.key;
        const valInUrl = urlQueryParamsObject[queryParamKey];
        const isMultiValue = configObject.isMultiValue || false;
        const val = getArrayValForMultiValParams(valInUrl, isMultiValue);
        const configKey: PageQueryParamKeys<P> = configObject.key;

        if (val === undefined || val === null || (isMultiValue && val.length === 0)) {
            result[configKey] = configObject?.defaultValue;
        } else if (typeof configObject.parseValue === 'function') {
            result[configKey] = Array.isArray(val)
                ? val.map(configObject.parseValue)
                : configObject.parseValue(val);
        } else {
            result[configKey] = val as ExtractedPageParamsValuesType<typeof configKey, P>;
        }

        return result;
    }, {} as PageQueryParamValues<P>);
};
export default getPageQueryParamsValues;