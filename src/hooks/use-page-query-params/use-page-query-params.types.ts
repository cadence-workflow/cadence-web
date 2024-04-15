export type { ParsedQuery } from 'query-string';
export type QueryParamSetterExtraConfig = {
    replace?: boolean,
    pageRerender?: boolean // by default when url changes the whole pages rerender, set to false if only components that uses the hook(& their children) needs to be rerenderd
} | undefined;
export type ParseValueFunction<T> = (value: string) => (T | undefined)
export type ParseValueFunctionOptional<T> = T extends string ? { parseValue?: ParseValueFunction<T> | undefined } : { parseValue: ParseValueFunction<T> };

//TODO: K now accepts Type of string so the user can pass PageQueryParam<string, any> 
// an enhancement is to force user to use literal strings e.g PageQueryParam<"mykey",any>
export type PageQueryParam<K extends string, T = any> = {
    key: K;
    queryParamKey?: string;
    defaultValue?: T;
    isMultiValue?: false;
} & ParseValueFunctionOptional<T>;

export type PageQueryParamMultiValue<K extends string, T extends any[]> = {
    key: K;  // key to get/set url query param, also it would be used as the query param name in the url if `queryParamKey` is not set
    queryParamKey?: string; // use to give a different query param name in the url than the one used in code. this can be used if you want appreviated name in the url while keeping the `key` more readable in code
    defaultValue?: T; // default value to be used if the query param is not present in url
    isMultiValue: true; // indicates if this query param accepts multiple values and makes sure value is always returned as array even if the query param at some point has single value
} & (T extends Array<infer I> ? ParseValueFunctionOptional<I> : never);


export type PageQueryParams = (PageQueryParam<string, any> | PageQueryParamMultiValue<string, any[]>)[];
export type PageQueryParamKeys<P extends PageQueryParams> = keyof PageQueryParamValues<P>;

export type PageQueryParamSetter<P extends PageQueryParams> = (newParams: Partial<PageQueryParamSetterValues<P>>, setterExtraConfig?: QueryParamSetterExtraConfig) => void

// get the type for the values object of the page query params e.g {count: 1}
// The Extracted type is the keys of the available query params and the type of the value corresponding to the key
// the choice between string | string[] is done base on if the queryParam is MultiValue or not
export type PageQueryParamValues<B extends PageQueryParams> = {
    [K in B[number]['key']]: ExtractedPageParamsValuesType<K, B>;
};

export type ExtractedPageParamsValuesType<K extends string, B extends PageQueryParams> =
    B extends (infer ParamType)[]
    ? ParamType extends PageQueryParam<K, infer V> ? V :
    ParamType extends PageQueryParamMultiValue<K, infer MV> ? MV :
    never
    : never;

// get the type for the values object that can be used to set the page query params e.g {search:"text"}
// The Extracted type is the keys of the available query params and the value can be string | string[] | undefined
// the choice between string | string[] is done base on if the queryParam is MultiValue or not
export type PageQueryParamSetterValues<B extends PageQueryParams> = {
    [K in B[number]['key']]: ExtractedPageParamsSetterType<K, B>;
};

export type ExtractedPageParamsSetterType<K extends string, B extends PageQueryParams> =
    B extends (infer ParamType)[]
    ? ParamType extends PageQueryParam<K, infer V> ? (V extends string ? (V | undefined) : (string | undefined)) : // Check if the param extends string we return the type itself as it can be an enum otherwise force string or undefined
    ParamType extends PageQueryParamMultiValue<K, infer MV> ? (MV extends string[] ? (MV | undefined) : (string[] | undefined)) : // Check if the param extends string[] we return the type itself as it can be an enum otherwise force string or undefined
    never
    : never;

