import {
  PageQueryParam,
  PageQueryParamMultiValue,
} from '../use-page-query-params.types';

export const queryParamsConfig: [
  PageQueryParam<'sortBy', string | undefined>,
  PageQueryParam<'aliased', string | undefined>,
  PageQueryParam<'defaulted', string>,
  PageQueryParam<'parsed', number | undefined>,
  PageQueryParamMultiValue<'parsedMultiVal', number[] | undefined>,
  PageQueryParamMultiValue<'multiValDefaulted', string[]>,
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
    parseValue: (vals) => vals.map((v) => parseInt(v)),
    isMultiValue: true,
  },
  {
    key: 'multiValDefaulted',
    defaultValue: ['a'],
    isMultiValue: true,
  },
];
