import React from 'react';

import { render } from '@/test-utils/rtl';

import WorkflowSummaryTabJsonView from '../workflow-history-event-details-json';

jest.mock('@/components/copy-text-button/copy-text-button', () =>
  jest.fn(({ textToCopy }) => <div>Copy Button: {textToCopy}</div>)
);

jest.mock('@/components/pretty-json/pretty-json', () =>
  jest.fn(() => <div>PrettyJson Mock</div>)
);

describe('WorkflowSummaryTabJsonView Component', () => {
  const inputJson = { input: 'inputJson' };

  it('renders correctly with initial props', () => {
    const { getByText } = render(
      <WorkflowSummaryTabJsonView entryValue={inputJson} />
    );

    expect(getByText('PrettyJson Mock')).toBeInTheDocument();
  });

  it('renders copy text button and pass the correct text', () => {
    const { getByText } = render(
      <WorkflowSummaryTabJsonView entryValue={inputJson} />
    );

    const copyButton = getByText(/Copy Button/);
    expect(copyButton).toBeInTheDocument();
    expect(copyButton.innerHTML).toMatch(JSON.stringify(inputJson, null, '\t'));
  });
});
