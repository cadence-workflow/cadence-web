import { useContext } from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import MarkdownContextProvider, {
  MarkdownContext,
} from '../markdown-context-provider';

function Consumer() {
  const {
    fieldValues,
    fieldMeta,
    setFieldValue,
    registerField,
    unregisterField,
  } = useContext(MarkdownContext);
  return (
    <>
      <button
        onClick={() =>
          registerField?.('amount', { type: 'number', required: true }, '5')
        }
      >
        register
      </button>
      <button
        onClick={() =>
          registerField?.('constructor', { type: 'text', required: false }, 'x')
        }
      >
        register constructor
      </button>
      <button onClick={() => unregisterField?.('amount')}>unregister</button>
      <button onClick={() => setFieldValue?.('amount', '42')}>set</button>
      <pre data-testid="values">{JSON.stringify(fieldValues)}</pre>
      <pre data-testid="meta">{JSON.stringify(fieldMeta)}</pre>
    </>
  );
}

describe(MarkdownContextProvider.name, () => {
  it('registers a field with its default value', async () => {
    const { user } = setup({});

    await user.click(screen.getByText('register'));

    expect(screen.getByTestId('values')).toHaveTextContent('{"amount":"5"}');
    expect(screen.getByTestId('meta')).toHaveTextContent(
      '{"amount":{"type":"number","required":true}}'
    );
  });

  it('does not overwrite a typed value when a field registers again', async () => {
    const { user } = setup({});

    await user.click(screen.getByText('register'));
    await user.click(screen.getByText('set'));
    await user.click(screen.getByText('register'));

    expect(screen.getByTestId('values')).toHaveTextContent('{"amount":"42"}');
  });

  it('removes field metadata on unregister and keeps the value', async () => {
    const { user } = setup({});

    await user.click(screen.getByText('register'));
    await user.click(screen.getByText('unregister'));

    expect(screen.getByTestId('meta').textContent).toBe('{}');
    expect(screen.getByTestId('values')).toHaveTextContent('{"amount":"5"}');
  });

  it('sets the default for a field named like an inherited property', async () => {
    const { user } = setup({});

    await user.click(screen.getByText('register constructor'));

    expect(screen.getByTestId('values')).toHaveTextContent(
      '{"constructor":"x"}'
    );
  });

  it('keeps field values when the provider re-renders with new props', async () => {
    const { user, rerender } = setup({});

    await user.click(screen.getByText('set'));
    rerender(
      <MarkdownContextProvider domain="other-domain">
        <Consumer />
      </MarkdownContextProvider>
    );

    expect(screen.getByTestId('values')).toHaveTextContent('{"amount":"42"}');
  });
});

function setup({ domain }: { domain?: string }) {
  const user = userEvent.setup();
  const result = render(
    <MarkdownContextProvider domain={domain}>
      <Consumer />
    </MarkdownContextProvider>
  );
  return { user, rerender: result.rerender };
}
