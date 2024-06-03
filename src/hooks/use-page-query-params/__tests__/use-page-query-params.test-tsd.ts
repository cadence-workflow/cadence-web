import { expectAssignable, expectNotAssignable } from 'tsd-lite';
import type {
  PageQueryParam,
  PageQueryParamMultiValue,
} from '../use-page-query-params.types.ts';

/**
 * describe PageQueryParam
 * */

// it should require defaultValue since the type doesn't include undefined
expectAssignable<PageQueryParam<'stringParam', string>>({
  key: 'stringParam',
  defaultValue: '1',
} as const);

expectNotAssignable<PageQueryParam<'stringParam', string>>({
  key: 'stringParam',
  // error: defaultValue is required
} as const);

// it should accept defaultValue with the same type as the query param
expectAssignable<PageQueryParam<'stringParam', string>>({
  key: 'stringParam',
  defaultValue: 'string',
} as const);

expectNotAssignable<PageQueryParam<'stringParam', string>>({
  key: 'stringParam',
  defaultValue: 1, //error: number is not assignable to string
} as const);

// it should require parseValue since the type is not string
expectAssignable<PageQueryParam<'numericParam', number>>({
  key: 'numericParam',
  parseValue: () => 1,
  defaultValue: 1,
} as const);

expectNotAssignable<PageQueryParam<'numericParam', number>>({
  key: 'numericParam',
  defaultValue: 1,
  // error: parseValue is required
} as const);

// it should allow both string or number types as parseValue return type and defaultValue
expectAssignable<PageQueryParam<'unionTypes', string | number>>({
  key: 'unionTypes',
  parseValue: (value: string) => {
    if (value === 'value') return 'stringValue';
    return 1;
  },
  defaultValue: '1',
} as const);

expectAssignable<PageQueryParam<'unionTypes', string | number>>({
  key: 'unionTypes',
  parseValue: (value: string) => {
    if (value === 'value') return 'stringValue';
    return 1;
  },
  defaultValue: 1,
} as const);

expectNotAssignable<PageQueryParam<'unionTypes', string | number>>({
  key: 'unionTypes',
  parseValue: (value: string) => {
    if (value === 'value') return 'stringValue';
    return 1;
  },
  defaultValue: true, // error: boolean is not assignable to string | number
} as const);

expectNotAssignable<PageQueryParam<'unionTypes', string | number>>({
  key: 'unionTypes',
  parseValue: () => true, // error: boolean is not assignable to string | number
  defaultValue: 1,
} as const);

// it should accept optional defaultValue since the type includes undefined
expectAssignable<
  PageQueryParam<'optionalUnionTypes', string | number | undefined>
>({
  key: 'optionalUnionTypes',
} as const);

expectAssignable<
  PageQueryParam<'optionalUnionTypes', string | number | undefined>
>({
  key: 'optionalUnionTypes',
  defaultValue: undefined,
} as const);

expectAssignable<
  PageQueryParam<'optionalUnionTypes', string | number | undefined>
>({
  key: 'optionalUnionTypes',
  defaultValue: 1,
} as const);

expectAssignable<
  PageQueryParam<'optionalUnionTypes', string | number | undefined>
>({
  key: 'optionalUnionTypes',
  defaultValue: '1',
} as const);

// it accepts union PageQueryParams
expectAssignable<
  | PageQueryParam<'orQueryParam', string>
  | PageQueryParam<'orQueryParam', number>
>({
  key: 'orQueryParam',
  defaultValue: `1`, // query param is string it will be parsed as string
} as const);

expectAssignable<
  | PageQueryParam<'orQueryParam', string>
  | PageQueryParam<'orQueryParam', number>
>({
  key: 'orQueryParam',
  queryParamKey: 'sc',
  defaultValue: 1, // query param is number it will be parsed as number
  parseValue: (value: string) => {
    if (value === 'value') return 1;
    return 1;
  },
} as const);

expectNotAssignable<
  | PageQueryParam<'orQueryParam', string>
  | PageQueryParam<'orQueryParam', number>
>({
  key: 'orQueryParam',
  queryParamKey: 'sc',
  defaultValue: '1', // error: mixing string and number types in the same configurations
  parseValue: (value: string) => {
    if (value === 'value') return 1;
    return 1;
  },
} as const);

/**
 * describe PageQueryParamMultiValue
 * */

// it should require defaultValue since the type doesn't include undefined
expectAssignable<PageQueryParamMultiValue<'multiValString', string[]>>({
  key: 'multiValString',
  isMultiValue: true,
  defaultValue: ['a'] as string[],
} as const);

expectNotAssignable<PageQueryParamMultiValue<'multiValString', string[]>>({
  key: 'multiValString',
  isMultiValue: true,
} as const);

expectNotAssignable<PageQueryParamMultiValue<'multiValString', string[]>>({
  key: 'multiValString',
  isMultiValue: true,
  defaultValue: [1] as number[], // number[] is not assignable to string[]
} as const);

// it should accept optional defaultValue since the type includes undefined
expectAssignable<
  PageQueryParamMultiValue<'multiValStringOptional', string[] | undefined>
>({
  key: 'multiValStringOptional',
  isMultiValue: true,
} as const);

expectAssignable<
  PageQueryParamMultiValue<'multiValStringOptional', string[] | undefined>
>({
  key: 'multiValStringOptional',
  isMultiValue: true,
  defaultValue: undefined,
} as const);

expectAssignable<
  PageQueryParamMultiValue<'multiValStringOptional', string[] | undefined>
>({
  key: 'multiValStringOptional',
  isMultiValue: true,
  defaultValue: ['a'] as string[],
} as const);

// it should accept number or boolean arrays as return of parseValue and for assigning defaultValue
expectAssignable<
  PageQueryParamMultiValue<'optionalMultivalueUnionTypes', number[] | boolean[]>
>({
  key: 'optionalMultivalueUnionTypes',
  isMultiValue: true,
  parseValue: (value: string[]) => {
    if (value.length) return [1];
    return [false];
  },
  defaultValue: [1] as number[],
} as const);

expectAssignable<
  PageQueryParamMultiValue<'optionalMultivalueUnionTypes', number[] | boolean[]>
>({
  key: 'optionalMultivalueUnionTypes',
  isMultiValue: true,
  parseValue: (value: string[]) => {
    if (value.length) return [1];
    return [false];
  },
  defaultValue: [true] as boolean[],
} as const);
