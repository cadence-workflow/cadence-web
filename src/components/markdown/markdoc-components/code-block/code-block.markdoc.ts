export const codeBlockMarkdocSchema = {
  render: 'CodeBlock',
  attributes: {
    content: { type: String, required: true },
    language: { type: String },
  },
};
