import { type ComponentType } from 'react';

import { type Config } from '@markdoc/markdoc';

export type Props = {
  content: string;
  config: Config;
  components: Record<string, ComponentType<any>>;
};
