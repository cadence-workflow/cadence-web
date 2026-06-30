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
const mockMemo: PrettyJsonValue = { team: 'cadence', note: 'test-note' };

describe(ScheduleDetailsJsonView.name, () => {
  describe('panel layout', () => {
    it('renders titled JSON when input is present', () => {
      setupPanel({});
      expect(screen.getByText('Input')).toBeInTheDocument();
      expect(screen.getByTestId('pretty-json')).toHaveTextContent(
        JSON.stringify(mockInput)
      );
    });

    it('passes formatted JSON to the copy button', () => {
      setupPanel({});
      expect(screen.getByTestId('copy-text-button').innerHTML).toMatch(
        losslessJsonStringify(mockInput, null, '\t')
      );
    });

    it('renders null JSON when input is missing', () => {
      setupPanel({ json: null });
      expect(screen.getByText('Input')).toBeInTheDocument();
      expect(screen.getByTestId('pretty-json')).toHaveTextContent('null');
    });

    it('renders multiple workflow inputs', () => {
      setupPanel({
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

  describe('inline layout', () => {
    it('renders formatted memo fields with PrettyJson', () => {
      setupInline({ json: mockMemo });
      expect(screen.getByTestId('pretty-json')).toHaveTextContent(
        JSON.stringify(mockMemo)
      );
    });

    it('renders copy text button with formatted memo JSON', () => {
      setupInline({ json: mockMemo });
      expect(screen.getByTestId('copy-text-button').innerHTML).toMatch(
        losslessJsonStringify(mockMemo, null, '\t')
      );
    });

    it('renders null JSON when memo is absent', () => {
      setupInline({ json: null });
      expect(screen.getByTestId('pretty-json')).toHaveTextContent('null');
    });
  });
});

function setupPanel({
  json = mockInput,
  title = 'Input',
}: Partial<Pick<Props, 'json' | 'title'>> = {}) {
  render(<ScheduleDetailsJsonView json={json} title={title} />);
}

function setupInline({ json }: Pick<Props, 'json'>) {
  render(<ScheduleDetailsJsonView json={json} />);
}
