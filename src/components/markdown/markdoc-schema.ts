import { type Config } from '@markdoc/markdoc';

import { brSchema } from './markdoc-components/br/br.markdoc';
import { codeBlockMarkdocSchema } from './markdoc-components/code-block/code-block.markdoc';
import { headingMarkdocSchema } from './markdoc-components/heading/heading.markdoc';
import { imageSchema } from './markdoc-components/image/image.markdoc';
import { inlineCodeMarkdocSchema } from './markdoc-components/inline-code/inline-code.markdoc';
import { listMarkdocSchema } from './markdoc-components/list/list.markdoc';
import { signalButtonMarkdocSchema } from './markdoc-components/signal-button/signal-button.markdoc';
import { startWorkflowButtonMarkdocSchema } from './markdoc-components/start-workflow-button/start-workflow-button.markdoc';

export const markdocConfig: Config = {
  tags: {
    signal: signalButtonMarkdocSchema,
    start: startWorkflowButtonMarkdocSchema,
    image: imageSchema,
    br: brSchema,
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
        width: { type: String },
        height: { type: String },
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
    heading: headingMarkdocSchema,
    list: listMarkdocSchema,
    fence: codeBlockMarkdocSchema,
    code: inlineCodeMarkdocSchema,
  },
};
