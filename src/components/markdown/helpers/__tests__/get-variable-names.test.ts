import { parse } from '@markdoc/markdoc';

import getVariableNames from '../get-variable-names';

function getAttributes(source: string) {
  const ast = parse(source);
  const tag = Array.from(ast.walk()).find((node) => node.type === 'tag');
  return tag?.attributes;
}

describe(getVariableNames.name, () => {
  it('finds variables in nested objects and arrays', () => {
    const attributes = getAttributes(
      '{% signal input={"a":$one,"b":{"c":[{"d":$two}]}} wfId=$three /%}'
    );

    expect(getVariableNames(attributes).sort()).toEqual([
      'one',
      'three',
      'two',
    ]);
  });

  it('removes duplicates and keeps the first path segment', () => {
    const attributes = getAttributes(
      '{% signal input={"a":$one,"b":$one,"c":$two.x} /%}'
    );

    expect(getVariableNames(attributes).sort()).toEqual(['one', 'two']);
  });

  it('returns an empty list for plain values', () => {
    expect(getVariableNames({ a: 1, b: ['x', null] })).toEqual([]);
    expect(getVariableNames(undefined)).toEqual([]);
  });
});
