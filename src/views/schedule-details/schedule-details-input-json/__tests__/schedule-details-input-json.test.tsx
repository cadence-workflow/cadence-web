import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import losslessJsonStringify from '@/utils/lossless-json-stringify';

import ScheduleDetailsInputJson from '../schedule-details-input-json';

jest.mock('@/components/copy-text-button/copy-text-button', () =>
  jest.fn(({ textToCopy }) => <div>Copy Button: {textToCopy}</div>)
);

jest.mock('@/components/pretty-json/pretty-json', () =>
  jest.fn(({ json }) => <div>PrettyJson Mock: {JSON.stringify(json)}</div>)
);

const mockInputPayload = {
  data: 'eyJ3b3JrZmxvd0FyZyI6InRlc3QtdmFsdWUifQ==',
};

describe(ScheduleDetailsInputJson.name, () => {
  it('renders input JSON when input is present', () => {
    setup({});
    expect(screen.getByText('Input')).toBeInTheDocument();
    expect(
      screen.getByText(/PrettyJson Mock: \[{"workflowArg":"test-value"}\]/)
    ).toBeInTheDocument();
  });

  it('passes formatted input to the copy button', () => {
    setup({});
    const parsedInput = [{ workflowArg: 'test-value' }];
    const copyButton = screen.getByText(/Copy Button:/);
    expect(copyButton).toBeInTheDocument();
    expect(copyButton.innerHTML).toMatch(
      losslessJsonStringify(parsedInput, null, '\t')
    );
  });

  it('renders null when input is missing', () => {
    setup({ input: null });
    expect(screen.getByText('Input')).toBeInTheDocument();
    expect(screen.getByText('PrettyJson Mock: null')).toBeInTheDocument();
  });

  it('renders null when input payload has no data', () => {
    setup({ input: { data: '' } });
    expect(screen.getByText('Input')).toBeInTheDocument();
    expect(screen.getByText('PrettyJson Mock: null')).toBeInTheDocument();
  });

  it('parses multiple workflow inputs', () => {
    setup({
      input: {
        data: btoa('{"name": "John", "age": 30} {"name": "Jane", "age": 25}'),
      },
    });
    expect(
      screen.getByText(
        /PrettyJson Mock: \[{"name":"John","age":30},{"name":"Jane","age":25}\]/
      )
    ).toBeInTheDocument();
  });
});

function setup({
  input = mockInputPayload,
}: {
  input?: { data: string } | null;
}) {
  render(<ScheduleDetailsInputJson input={input} />);
}
