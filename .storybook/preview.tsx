import type { Preview } from '@storybook/nextjs';

import StyletronProvider from '@/providers/styletron-provider';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <StyletronProvider>
        <Story />
      </StyletronProvider>
    ),
  ],
};

export default preview;
