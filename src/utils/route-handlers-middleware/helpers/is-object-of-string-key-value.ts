import isPlainObject from 'lodash/isPlainObject';

export default function isObjectOfStringKeyValue(
  v: any
): v is Record<string, string> {
  return (
    isPlainObject(v) &&
    Reflect.ownKeys(v).every((k) => typeof k === 'string') &&
    Object.values(v).every((v) => typeof v === 'string')
  );
}
