import { type Config } from '@markdoc/markdoc';

import { codeBlockSchema } from './components/code-block/code-block.markdoc';
import { headingSchema } from './components/heading/heading.markdoc';
import { inlineCodeSchema } from './components/inline-code/inline-code.markdoc';
import { listSchema } from './components/list/list.markdoc';
import { signalButtonSchema } from './components/signal-button/signal-button.markdoc';
import { startWorkflowButtonSchema } from './components/start-workflow-button/start-workflow-button.markdoc';

export const markdocConfig: Config = {
  tags: {
    signal: signalButtonSchema,
    start: startWorkflowButtonSchema,
  },
  nodes: {
    // Standard HTML nodes
    paragraph: {
      render: 'p',
    },
    link: {
      render: 'a',
      attributes: {
        href: { type: String, required: true },
        title: { type: String },
      },
    },
    item: {
      render: 'li',
    },
    strong: {
      render: 'strong',
    },
    em: {
      render: 'em',
    },
    image: {
      render: 'img',
      attributes: {
        src: { type: String, required: true },
        alt: { type: String },
        title: { type: String },
      },
    },
    blockquote: {
      render: 'blockquote',
    },
    hr: {
      render: 'hr',
    },
    table: {
      render: 'table',
    },
    thead: {
      render: 'thead',
    },
    tbody: {
      render: 'tbody',
    },
    tr: {
      render: 'tr',
    },
    th: {
      render: 'th',
      attributes: {
        align: { type: String },
      },
    },
    td: {
      render: 'td',
      attributes: {
        align: { type: String },
      },
    },

    // Custom component nodes
    heading: headingSchema,
    list: listSchema,
    fence: codeBlockSchema,
    code: inlineCodeSchema,
  },
};
