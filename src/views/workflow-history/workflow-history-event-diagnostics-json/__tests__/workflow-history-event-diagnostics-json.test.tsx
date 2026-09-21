import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import losslessJsonStringify from '@/utils/lossless-json-stringify';

import WorkflowHistoryEventDiagnosticsJson from '../workflow-history-event-diagnostics-json';

jest.mock('@/components/copy-text-button/copy-text-button', () =>
  jest.fn(({ textToCopy }) => <div>Copy Button: {textToCopy}</div>)
);

jest.mock('@/components/pretty-json/pretty-json', () =>
  jest.fn(() => <div>PrettyJson Mock</div>)
);

describe(WorkflowHistoryEventDiagnosticsJson.name, () => {
  const losslessInputJson = {
    input: 'inputJson',
    long: BigInt('9007199254740991345435'),
  };

  it('renders correctly with initial props', () => {
    setup({ value: losslessInputJson });

    expect(screen.getByText('PrettyJson Mock')).toBeInTheDocument();
  });

  it('renders copy text button and pass the correct text', () => {
    setup({ value: losslessInputJson });

    const copyButton = screen.getByText(/Copy Button/);
    expect(copyButton).toBeInTheDocument();
    expect(copyButton.innerHTML).toMatch(
      losslessJsonStringify(losslessInputJson, null, '\t')
    );
  });
});

function setup({ value }: { value: unknown }) {
  render(<WorkflowHistoryEventDiagnosticsJson value={value} />);
}
