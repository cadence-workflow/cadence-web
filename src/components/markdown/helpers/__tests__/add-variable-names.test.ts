import { parse, type Config } from '@markdoc/markdoc';

import addVariableNames from '../add-variable-names';

const config: Config = {
  tags: {
    button: {
      attributes: {
        input: { type: Object },
        variableNames: { type: Array },
      },
    },
    plain: { attributes: { input: { type: Object } } },
  },
};

function getTags(source: string) {
  const ast = addVariableNames(parse(source), config);
  return Array.from(ast.walk()).filter((node) => node.type === 'tag');
}

describe(addVariableNames.name, () => {
  it('adds the variable names to tags that declare variableNames', () => {
    const [tag] = getTags('{% button input={"a":[$one,{"b":$two}]} /%}');

    expect(tag.attributes.variableNames).toEqual(['one', 'two']);
  });

  it('adds an empty list when a tag uses no variables', () => {
    const [tag] = getTags('{% button input={"a":1} /%}');

    expect(tag.attributes.variableNames).toEqual([]);
  });

  it('leaves other tags and unknown tags alone', () => {
    const tags = getTags(
      '{% plain input={"a":$one} /%}\n\n{% other x=$one /%}'
    );

    expect(tags).toHaveLength(2);
    tags.forEach((tag) =>
      expect(tag.attributes).not.toHaveProperty('variableNames')
    );
  });

  it('does not treat an inherited tag name as a tag definition', () => {
    const [tag] = getTags('{% toString x=$one /%}');

    expect(tag.attributes).not.toHaveProperty('variableNames');
  });
});
