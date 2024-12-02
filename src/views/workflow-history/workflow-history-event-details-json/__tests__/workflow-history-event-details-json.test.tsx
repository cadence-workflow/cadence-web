import React from 'react';

import { render } from '@/test-utils/rtl';

import losslessJsonStringify from '@/utils/lossless-json-stringify';

import WorkflowSummaryTabJsonView from '../workflow-history-event-details-json';

jest.mock('@/components/copy-text-button/copy-text-button', () =>
  jest.fn(({ textToCopy }) => <div>Copy Button: {textToCopy}</div>)
);

jest.mock('@/components/pretty-json/pretty-json', () =>
  jest.fn(() => <div>PrettyJson Mock</div>)
);

describe('WorkflowHistoryEventDetailsJson', () => {
  const losslessInputJson = {
    input: 'inputJson',
    long: BigInt('9007199254740991345435'),
  };

  it('renders correctly with initial props', () => {
    const { getByText } = render(
      <WorkflowSummaryTabJsonView entryValue={losslessInputJson} />
    );

    expect(getByText('PrettyJson Mock')).toBeInTheDocument();
  });

  it('renders copy text button and pass the correct text', () => {
    const { getByText } = render(
      <WorkflowSummaryTabJsonView entryValue={losslessInputJson} />
    );

    const copyButton = getByText(/Copy Button/);
    expect(copyButton).toBeInTheDocument();
    expect(copyButton.innerHTML).toMatch(
      losslessJsonStringify(losslessInputJson, null, '\t')
    );
  });
});
