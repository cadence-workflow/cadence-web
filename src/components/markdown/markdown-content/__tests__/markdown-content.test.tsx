import { type Config } from '@markdoc/markdoc';

import { render, screen } from '@/test-utils/rtl';

import { MarkdownContext } from '../../markdown-context-provider/markdown-context-provider';
import { type MarkdownContextType } from '../../markdown-context-provider/markdown-context-provider.types';
import MarkdownContent from '../markdown-content';

describe(MarkdownContent.name, () => {
  it('renders a field value as a variable', () => {
    setup({
      content: 'Total: {% $amount %}',
      contextValue: {
        fieldValues: { amount: '12.5' },
        fieldMeta: { amount: { type: 'number', required: true } },
      },
    });

    expect(screen.getByText('Total: 12.5')).toBeInTheDocument();
  });

  it('renders nothing for an undefined variable', () => {
    setup({ content: 'Total: {% $amount %}', contextValue: {} });

    expect(screen.getByText('Total:')).toBeInTheDocument();
  });
});

function setup({
  content,
  contextValue,
}: {
  content: string;
  contextValue: MarkdownContextType;
}) {
  const config: Config = {};
  render(
    <MarkdownContext.Provider value={contextValue}>
      <MarkdownContent content={content} config={config} components={{}} />
    </MarkdownContext.Provider>
  );
}
