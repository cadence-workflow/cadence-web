export const imageSchema = {
  render: 'Image',
  attributes: {
    src: { type: String, required: true },
    alt: { type: String },
    title: { type: String },
    width: { type: String },
    height: { type: String },
  },
};
