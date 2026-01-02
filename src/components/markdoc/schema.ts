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

const startWorkflowButtonSchema = {
  render: 'StartWorkflowButton',
  attributes: {
    workflowType: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
    },
    cluster: {
      type: String,
      required: true,
    },
    taskList: {
      type: String,
      required: true,
    },
    wfId: {
      type: String,
      required: false,
    },
    input: {
      type: Object,
      required: false,
    },
    timeoutSeconds: {
      type: Number,
      required: false,
    },
    sdkLanguage: {
      type: String,
      required: false,
    },
  },
};

export const markdocConfig: Config = {
  tags: {
    signal: signalButtonSchema,
    start: startWorkflowButtonSchema,
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
        content: { type: String },
        language: { type: String },
      },
    },
    code: {
      render: 'InlineCode',
      attributes: {
        content: { type: String },
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
