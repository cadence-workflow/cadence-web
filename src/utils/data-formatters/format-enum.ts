import flowRight from 'lodash/flowRight';
import lowerCase from 'lodash/lowerCase';
import snakeCase from 'lodash/snakeCase';
import startCase from 'lodash/startCase';

type Formatter = (value: string) => string;

const convertToUpper: Formatter = (value: string) => value.toUpperCase();

const upperSnakeCase: Formatter = flowRight([snakeCase, convertToUpper]);

const removeWhiteSpace: Formatter = (value: string) => value.replace(/\s/g, '');

const pascalCase: Formatter = flowRight([
  lowerCase,
  startCase,
  removeWhiteSpace,
]);

// Case formatter map with strict typing
const caseFormatterMap = {
  snake: upperSnakeCase,
  pascal: pascalCase,
} as const;

// Case format types
type CaseFormat = keyof typeof caseFormatterMap;

// Utility type to remove a given prefix from a string
type RemovePrefix<
  T extends string,
  Prefix extends string,
> = T extends `${Prefix}_${infer Rest}` ? Rest : T;

// Template literal types for string transformation
type ToUpperSnakeCase<T extends string> = T extends `${infer Head}${infer Tail}`
  ? `${Uppercase<Head>}${ToUpperSnakeCase<Tail>}`
  : T;

type ToPascalCase<T extends string> = T extends `${infer First}_${infer Rest}`
  ? `${Capitalize<Lowercase<First>>}${ToPascalCase<Capitalize<Rest>>}`
  : Capitalize<Lowercase<T>>;

// Utility type to check if a string contains "INVALID" and exclude it from the type
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ExcludeInvalid<T extends string> = T extends `${infer _}INVALID${infer _}`
  ? never
  : T;

type FormattedEnumValue<
  T extends string,
  P extends string,
  F extends CaseFormat,
> =
  ExcludeInvalid<T> extends never
    ? null
    : F extends 'snake'
      ? ToUpperSnakeCase<RemovePrefix<ExcludeInvalid<T>, P>> | null
      : ToPascalCase<RemovePrefix<ExcludeInvalid<T>, P>> | null;

const formatEnum = <
  T extends string,
  P extends string = '',
  F extends CaseFormat = 'snake',
>(
  value: T | null | undefined,
  prefix?: P,
  caseFormat: F = 'snake' as F
): FormattedEnumValue<T, P, F> => {
  if (!value || value.includes('INVALID')) {
    return null;
  }

  // Remove prefix from the value if provided
  const valueRemovedPrefix = prefix
    ? value.replace(new RegExp(`^${prefix}_`), '')
    : value;

  const caseFormatter = caseFormatterMap[caseFormat];

  return caseFormatter(valueRemovedPrefix) as FormattedEnumValue<T, P, F>;
};

export default formatEnum;
