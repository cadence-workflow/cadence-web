import { Ast } from '@markdoc/markdoc';

export default function getVariableNames(value: unknown): string[] {
  const names = new Set<string>();

  const walk = (current: unknown) => {
    if (current instanceof Ast.Variable) {
      const [name] = current.path;
      if (typeof name === 'string') names.add(name);
    } else if (Array.isArray(current)) {
      current.forEach(walk);
    } else if (current !== null && typeof current === 'object') {
      Object.values(current).forEach(walk);
    }
  };
  walk(value);

  return Array.from(names);
}
