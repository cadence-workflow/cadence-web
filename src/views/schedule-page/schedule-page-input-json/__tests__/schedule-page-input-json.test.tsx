import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import SchedulePageInputJson from '../schedule-page-input-json';

jest.mock('@/components/copy-text-button/copy-text-button', () =>
  jest.fn(({ textToCopy }) => <div>Copy Button: {textToCopy}</div>)
);

jest.mock('@/components/pretty-json/pretty-json', () =>
  jest.fn(({ json }) => (
    <div>PrettyJson Mock: {JSON.stringify(json)}</div>
  ))
);

const mockInputPayload = {
  data: 'eyJ3b3JrZmxvd0FyZyI6InRlc3QtdmFsdWUifQ==',
};

describe(SchedulePageInputJson.name, () => {
  it('renders section title when input is present', () => {
    setup({});
    expect(
      screen.getByRole('heading', { name: 'Schedule input' })
    ).toBeInTheDocument();
  });

  it('renders parsed JSON via PrettyJson', () => {
    setup({});
    expect(
      screen.getByText(
        'PrettyJson Mock: {"workflowArg":"test-value"}'
      )
    ).toBeInTheDocument();
  });

  it('renders copy button with stringified JSON', () => {
    setup({});
    const copyButton = screen.getByText(/Copy Button:/);
    expect(copyButton).toBeInTheDocument();
    expect(copyButton.innerHTML).toMatch(
      JSON.stringify({ workflowArg: 'test-value' }, null, '\t')
    );
  });

  it('renders nothing when input is missing', () => {
    setup({ input: null });
    expect(
      screen.queryByRole('heading', { name: 'Schedule input' })
    ).not.toBeInTheDocument();
  });

  it('renders nothing when input payload has no data', () => {
    setup({ input: { data: null } });
    expect(
      screen.queryByRole('heading', { name: 'Schedule input' })
    ).not.toBeInTheDocument();
  });

  it('renders non-JSON payload as a string value', () => {
    setup({
      input: { data: Buffer.from('plain-text-input').toString('base64') },
    });
    expect(
      screen.getByText('PrettyJson Mock: "plain-text-input"')
    ).toBeInTheDocument();
  });

  it('collapses JSON content when toggle button is clicked', async () => {
    const { user } = setup({});
    expect(
      screen.getByText('PrettyJson Mock: {"workflowArg":"test-value"}')
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /collapse schedule input details/i })
    );

    expect(
      screen.queryByText('PrettyJson Mock: {"workflowArg":"test-value"}')
    ).not.toBeInTheDocument();
  });

  it('expands JSON content again after collapsing', async () => {
    const { user } = setup({});

    await user.click(
      screen.getByRole('button', { name: /collapse schedule input details/i })
    );
    await user.click(
      screen.getByRole('button', { name: /expand schedule input details/i })
    );

    expect(
      screen.getByText('PrettyJson Mock: {"workflowArg":"test-value"}')
    ).toBeInTheDocument();
  });
});

function setup({
  input = mockInputPayload,
}: {
  input?: { data?: string | null } | null;
}) {
  const user = userEvent.setup();
  render(<SchedulePageInputJson input={input} />);
  return { user };
}
