export const inputFieldMarkdocSchema = {
  render: 'InputField',
  selfClosing: true,
  attributes: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
      default: 'text',
      matches: ['text', 'number'],
    },
    default: {
      type: [String, Number],
      required: false,
    },
    required: {
      type: Boolean,
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
    },
  },
};
