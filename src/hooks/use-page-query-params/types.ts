
export type QueryParamSetterLiteralValue = string | number | boolean | null | undefined;
export type QueryParamSetterArrayValue = Array<QueryParamSetterLiteralValue>;
export type QueryParamSetterValue = QueryParamSetterLiteralValue | QueryParamSetterArrayValue;
export type QueryParamsValues = { [key: string]: any };
export type QueryParamSetterExtraConfig = {
    replace?: boolean,
    pageRerender?: boolean // by default when url changes the whole pages rerender, set to false if only components that uses the hook(& their children) needs to be rerenderd
} | undefined;
export type QueryParamsSetterObject = {
    [key: string]: QueryParamSetterValue;
};

export type PageQueryParamsSetter = (configKey: QueryParamsSetterObject, extraConfig?: QueryParamSetterExtraConfig) => void;


export type PageQueryParamConfig = {
    key: string; // key to get/set url query param, also it would be used as the query param name in the url if `queryParamKey` is not set
    queryParamKey?: string; // use to give a different query param name in the url than the one used in code. this can be used if you want appreviated name in the url while keeping the `key` more readable in code
    defaultValue?: unknown; // default value to be used if the query param is not present in url
    parseValue?: (v: string) => unknown; // all query params are strings, use `parseValue` to parse the value to the type needed in code.
    isMultiValue?: boolean; // indicates if this query param accepts multiple values and makes sure value is always returned as array even if the query param at some point has single value
};

export type { ParsedQuery } from 'query-string';
