import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import ScheduleDetailsJsonView from '../schedule-details-json-view';
import { type Props } from '../schedule-details-json-view.types';

jest.mock('@/components/copy-text-button/copy-text-button', () =>
  jest.fn(({ textToCopy }: { textToCopy: string }) => (
    <div data-testid="copy-text-button">{textToCopy}</div>
  ))
);

jest.mock('@/components/pretty-json/pretty-json', () =>
  jest.fn(({ json }: { json: unknown }) => (
    <div data-testid="pretty-json">{JSON.stringify(json)}</div>
  ))
);

const mockInput: PrettyJsonValue = [{ workflowArg: 'test-value' }];
const mockJson: PrettyJsonValue = { key: 'value', nested: { foo: 'bar' } };

describe(ScheduleDetailsJsonView.name, () => {
  it('renders JSON with PrettyJson', () => {
    setup({});
    expect(screen.getByTestId('pretty-json')).toHaveTextContent(
      JSON.stringify(mockJson)
    );
  });

  it('passes formatted JSON to the copy button', () => {
    setup({});
    expect(screen.getByTestId('copy-text-button').innerHTML).toMatch(
      losslessJsonStringify(mockJson, null, '\t')
    );
  });

  it('renders null JSON when json is null', () => {
    setup({ json: null });
    expect(screen.getByTestId('pretty-json')).toHaveTextContent('null');
  });

  describe('title', () => {
    it('renders the title when provided', () => {
      setup({ title: 'Input', json: mockInput });
      expect(screen.getByText('Input')).toBeInTheDocument();
    });

    it('does not render a title when omitted', () => {
      setup({ limitHeight: true });
      expect(screen.queryByText('Input')).not.toBeInTheDocument();
    });

    it('renders multiple workflow inputs', () => {
      setup({
        title: 'Input',
        json: [
          { name: 'John', age: 30 },
          { name: 'Jane', age: 25 },
        ],
      });
      expect(screen.getByTestId('pretty-json')).toHaveTextContent(
        JSON.stringify([
          { name: 'John', age: 30 },
          { name: 'Jane', age: 25 },
        ])
      );
    });
  });

  describe('limitHeight', () => {
    it('applies a max height when enabled', () => {
      setup({ limitHeight: true });
      expect(getBodyElement()).toHaveStyle({
        maxHeight: '50vh',
        overflow: 'auto',
      });
    });

    it('does not apply a max height by default', () => {
      setup({ title: 'Input', json: mockInput });
      expect(getBodyElement()).not.toHaveStyle({ maxHeight: '50vh' });
    });

    it('can be enabled alongside a title', () => {
      setup({ title: 'Input', json: mockInput, limitHeight: true });
      expect(screen.getByText('Input')).toBeInTheDocument();
      expect(getBodyElement()).toHaveStyle({
        maxHeight: '50vh',
        overflow: 'auto',
      });
    });
  });
});

function setup({ json = mockJson, ...rest }: Partial<Props> = {}) {
  render(<ScheduleDetailsJsonView json={json} {...rest} />);
}

function getBodyElement() {
  return screen.getByTestId('pretty-json').parentElement as HTMLElement;
}
