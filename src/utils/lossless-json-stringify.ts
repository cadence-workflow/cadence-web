import { stringify, type Reviver } from 'lossless-json';

export default function losslessJsonStringify(
  json: unknown,
  reviver?: Reviver | null | undefined,
  space?: string | number | undefined
) {
  const stringified = stringify(json, reviver, space, [
    {
      test: (value) => typeof value === 'bigint',
      stringify: (value) => (value || '').toString(),
    },
  ]);

  return stringified || '';
}
