import { type Config } from '@markdoc/markdoc';

const signalButtonSchema = {
  render: 'SignalButton',
  attributes: {
    signalName: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    input: {
      type: Object,
      required: false,
    },
    domain: {
      type: String,
      required: false,
    },
    cluster: {
      type: String,
      required: false,
    },
    workflowId: {
      type: String,
      required: false,
    },
    runId: {
      type: String,
      required: false,
    },
  },
};

export const markdocConfig: Config = {
  tags: {
    'signal-button': signalButtonSchema,
  },
  nodes: {
    // You can customize node rendering here if needed
    paragraph: {
      render: 'p',
    },
    heading: {
      render: 'Heading',
      attributes: {
        level: { type: Number, required: true },
      },
    },
    link: {
      render: 'a',
      attributes: {
        href: { type: String, required: true },
        title: { type: String },
      },
    },
    list: {
      render: 'List',
      attributes: {
        ordered: { type: Boolean },
      },
    },
    item: {
      render: 'li',
    },
    fence: {
      render: 'CodeBlock',
      attributes: {
        content: { type: String, render: false, required: true },
        language: { type: String },
      },
    },
    code: {
      render: 'code',
      attributes: {
        content: { type: String, render: false, required: true },
      },
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
  },
};
