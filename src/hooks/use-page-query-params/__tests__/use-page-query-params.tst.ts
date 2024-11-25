import { describe, expect, it } from 'tstyche';

import type {
  PageQueryParam,
  PageQueryParamMultiValue,
} from '../use-page-query-params.types.js';

describe('PageQueryParam', () => {
  it('should require defaultValue since the type does not include undefined', () => {
    expect<PageQueryParam<'stringParam', string>>().type.toBeAssignableWith({
      key: 'stringParam',
      defaultValue: '1',
    } as const);

    expect<PageQueryParam<'stringParam', string>>().type.not.toBeAssignableWith(
      {
        key: 'stringParam',
        // error: defaultValue is required
      } as const
    );
  });

  it('should accept defaultValue with the same type as the query param', () => {
    expect<PageQueryParam<'stringParam', string>>().type.toBeAssignableWith({
      key: 'stringParam',
      defaultValue: 'string',
    } as const);

    expect<PageQueryParam<'stringParam', string>>().type.not.toBeAssignableWith(
      {
        key: 'stringParam',
        defaultValue: 1, //error: number is not assignable to string
      } as const
    );
  });

  it('should require parseValue since the type is not string', () => {
    expect<PageQueryParam<'numericParam', number>>().type.toBeAssignableWith({
      key: 'numericParam',
      parseValue: () => 1,
      defaultValue: 1,
    } as const);

    expect<
      PageQueryParam<'numericParam', number>
    >().type.not.toBeAssignableWith({
      key: 'numericParam',
      defaultValue: 1,
      // error: parseValue is required
    } as const);
  });

  it('should allow both string or number types as parseValue return type and defaultValue', () => {
    expect<
      PageQueryParam<'unionTypes', string | number>
    >().type.toBeAssignableWith({
      key: 'unionTypes',
      parseValue: (value: string) => {
        if (value === 'value') return 'stringValue';
        return 1;
      },
      defaultValue: '1',
    } as const);

    expect<
      PageQueryParam<'unionTypes', string | number>
    >().type.toBeAssignableWith({
      key: 'unionTypes',
      parseValue: (value: string) => {
        if (value === 'value') return 'stringValue';
        return 1;
      },
      defaultValue: 1,
    } as const);

    expect<
      PageQueryParam<'unionTypes', string | number>
    >().type.not.toBeAssignableWith({
      key: 'unionTypes',
      parseValue: (value: string) => {
        if (value === 'value') return 'stringValue';
        return 1;
      },
      defaultValue: true, // error: boolean is not assignable to string | number
    } as const);

    expect<
      PageQueryParam<'unionTypes', string | number>
    >().type.not.toBeAssignableWith({
      key: 'unionTypes',
      parseValue: () => true, // error: boolean is not assignable to string | number
      defaultValue: 1,
    } as const);
  });

  it('should accept optional defaultValue since the type includes undefined', () => {
    expect<
      PageQueryParam<'optionalUnionTypes', string | number | undefined>
    >().type.toBeAssignableWith({
      key: 'optionalUnionTypes',
    } as const);

    expect<
      PageQueryParam<'optionalUnionTypes', string | number | undefined>
    >().type.toBeAssignableWith({
      key: 'optionalUnionTypes',
      defaultValue: undefined,
    } as const);

    expect<
      PageQueryParam<'optionalUnionTypes', string | number | undefined>
    >().type.toBeAssignableWith({
      key: 'optionalUnionTypes',
      defaultValue: 1,
    } as const);

    expect<
      PageQueryParam<'optionalUnionTypes', string | number | undefined>
    >().type.toBeAssignableWith({
      key: 'optionalUnionTypes',
      defaultValue: '1',
    } as const);
  });

  it('should accept union PageQueryParams', () => {
    expect<
      | PageQueryParam<'orQueryParam', string>
      | PageQueryParam<'orQueryParam', number>
    >().type.toBeAssignableWith({
      key: 'orQueryParam',
      defaultValue: `1`, // query param is string it will be parsed as string
    } as const);

    expect<
      | PageQueryParam<'orQueryParam', string>
      | PageQueryParam<'orQueryParam', number>
    >().type.toBeAssignableWith({
      key: 'orQueryParam',
      queryParamKey: 'sc',
      defaultValue: 1, // query param is number it will be parsed as number
      parseValue: (value: string) => {
        if (value === 'value') return 1;
        return 1;
      },
    } as const);

    expect<
      | PageQueryParam<'orQueryParam', string>
      | PageQueryParam<'orQueryParam', number>
    >().type.not.toBeAssignableWith({
      key: 'orQueryParam',
      queryParamKey: 'sc',
      defaultValue: '1', // error: mixing string and number types in the same configurations
      parseValue: (value: string) => {
        if (value === 'value') return 1;
        return 1;
      },
    } as const);
  });
});

describe('PageQueryParamMultiValue', () => {
  it('should require defaultValue since the type does not include undefined', () => {
    expect<
      PageQueryParamMultiValue<'multiValString', string[]>
    >().type.toBeAssignableWith({
      key: 'multiValString',
      isMultiValue: true,
      defaultValue: ['a'] as string[],
    } as const);

    expect<
      PageQueryParamMultiValue<'multiValString', string[]>
    >().type.not.toBeAssignableWith({
      key: 'multiValString',
      isMultiValue: true,
    } as const);

    expect<
      PageQueryParamMultiValue<'multiValString', string[]>
    >().type.not.toBeAssignableWith({
      key: 'multiValString',
      isMultiValue: true,
      defaultValue: [1] as number[], // number[] is not assignable to string[]
    } as const);
  });

  it('should accept optional defaultValue since the type includes undefined', () => {
    expect<
      PageQueryParamMultiValue<'multiValStringOptional', string[] | undefined>
    >().type.toBeAssignableWith({
      key: 'multiValStringOptional',
      isMultiValue: true,
    } as const);

    expect<
      PageQueryParamMultiValue<'multiValStringOptional', string[] | undefined>
    >().type.toBeAssignableWith({
      key: 'multiValStringOptional',
      isMultiValue: true,
      defaultValue: undefined,
    } as const);

    expect<
      PageQueryParamMultiValue<'multiValStringOptional', string[] | undefined>
    >().type.toBeAssignableWith({
      key: 'multiValStringOptional',
      isMultiValue: true,
      defaultValue: ['a'] as string[],
    } as const);
  });

  it('should accept number or boolean arrays as return of parseValue and for assigning defaultValue', () => {
    expect<
      PageQueryParamMultiValue<
        'optionalMultivalueUnionTypes',
        number[] | boolean[]
      >
    >().type.toBeAssignableWith({
      key: 'optionalMultivalueUnionTypes',
      isMultiValue: true,
      parseValue: (value: string[]) => {
        if (value.length) return [1];
        return [false];
      },
      defaultValue: [1] as number[],
    } as const);

    expect<
      PageQueryParamMultiValue<
        'optionalMultivalueUnionTypes',
        number[] | boolean[]
      >
    >().type.toBeAssignableWith({
      key: 'optionalMultivalueUnionTypes',
      isMultiValue: true,
      parseValue: (value: string[]) => {
        if (value.length) return [1];
        return [false];
      },
      defaultValue: [true] as boolean[],
    } as const);
  });
});
