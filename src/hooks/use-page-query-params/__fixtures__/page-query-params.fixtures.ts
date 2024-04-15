import { PageQueryParam, PageQueryParamMultiValue } from "../use-page-query-params.types";

export const queryParamsConfig: [
    PageQueryParam<"sortBy", string>,
    PageQueryParam<"aliased", string>,
    PageQueryParam<"defaulted", string>,
    PageQueryParam<"parsed", number>,
    PageQueryParamMultiValue<"parsedMultiVal", number[]>,
    PageQueryParamMultiValue<"multiValDefaulted", string[]>,
] = [
        {
            key: 'sortBy',
        },
        {
            key: 'aliased',
            queryParamKey: 'aliasName',
        },
        {
            key: 'defaulted',
            defaultValue: 'defaultValue',
        },
        {
            key: 'parsed',
            parseValue: (v) => (v ? parseInt(v) : 0),
        },
        {
            key: 'parsedMultiVal',
            parseValue: (v) => (v ? parseInt(v) : 0),
            isMultiValue: true,
        },
        {
            key: 'multiValDefaulted',
            defaultValue:["a"],
            isMultiValue: true,
        },
    ];