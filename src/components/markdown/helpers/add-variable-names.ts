import { type Config, type Node } from '@markdoc/markdoc';

import getVariableNames from './get-variable-names';

export default function addVariableNames(ast: Node, config: Config): Node {
  for (const node of Array.from(ast.walk())) {
    if (node.type !== 'tag' || !node.tag) continue;

    const tags = config.tags ?? {};
    const attributes = Object.hasOwn(tags, node.tag)
      ? tags[node.tag].attributes
      : undefined;

    if (attributes && Object.hasOwn(attributes, 'variableNames')) {
      node.attributes.variableNames = getVariableNames(node.attributes);
    }
  }
  return ast;
}
