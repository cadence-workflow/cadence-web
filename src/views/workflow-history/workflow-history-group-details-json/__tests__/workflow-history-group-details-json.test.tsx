import { type ModalProps } from 'baseui/modal';

import { render, screen, userEvent, within } from '@/test-utils/rtl';

import losslessJsonStringify from '@/utils/lossless-json-stringify';

import WorkflowHistoryGroupDetailsJson from '../workflow-history-group-details-json';

jest.mock('@/components/copy-text-button/copy-text-button', () =>
  jest.fn(({ textToCopy }) => (
    <div data-testid="copy-button">Copy Button: {textToCopy}</div>
  ))
);

jest.mock('@/components/pretty-json/pretty-json', () =>
  jest.fn(() => <div>PrettyJson Mock</div>)
);

jest.mock('baseui/modal', () => ({
  ...jest.requireActual('baseui/modal'),
  Modal: ({ isOpen, children }: ModalProps) =>
    isOpen ? (
      <div aria-modal aria-label="dialog" role="dialog">
        {typeof children === 'function' ? children() : children}
      </div>
    ) : null,
}));

describe(WorkflowHistoryGroupDetailsJson.name, () => {
  const mockEntryValue = {
    input: 'test-input',
    long: BigInt('9007199254740991345435'),
    nested: {
      field: 'nested-value',
    },
  };
  const mockEntryPath = 'header.fields.testField';

  it('renders correctly with initial props', () => {
    setup();
    expect(screen.getByText(mockEntryPath)).toBeInTheDocument();
    expect(screen.getByText('PrettyJson Mock')).toBeInTheDocument();
  });

  it('displays entryPath correctly', () => {
    setup();
    expect(screen.getByText(mockEntryPath)).toBeInTheDocument();
  });

  it('renders copy button with correct textToCopy', () => {
    setup();
    const copyButton = screen.getByTestId('copy-button');
    expect(copyButton).toBeInTheDocument();
    expect(copyButton.innerHTML).toMatch(
      losslessJsonStringify(mockEntryValue, null, '\t')
    );
  });

  it('opens modal when open full button is clicked', async () => {
    const { user } = setup();
    const buttons = screen.getAllByRole('button');
    const openFullButton = buttons[0];
    await user.click(openFullButton);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(mockEntryPath)).toBeInTheDocument();
    expect(within(dialog).getByText('PrettyJson Mock')).toBeInTheDocument();
  });

  it('displays entryPath in modal header', async () => {
    const { user } = setup();
    const buttons = screen.getAllByRole('button');
    const openFullButton = buttons[0];
    await user.click(openFullButton);

    const modalHeaders = screen.getAllByText(mockEntryPath);
    expect(modalHeaders.length).toBeGreaterThan(0);
  });

  it('renders copy button in modal with correct textToCopy', async () => {
    const { user } = setup();
    const buttons = screen.getAllByRole('button');
    const openFullButton = buttons[0];
    await user.click(openFullButton);

    const dialog = screen.getByRole('dialog');
    const copyButton = within(dialog).getByTestId('copy-button');
    expect(copyButton).toBeInTheDocument();
    expect(copyButton.innerHTML).toMatch(
      losslessJsonStringify(mockEntryValue, null, '\t')
    );
  });

  it('closes modal when close button is clicked', async () => {
    const { user } = setup();
    const buttons = screen.getAllByRole('button');
    const openFullButton = buttons[0];
    await user.click(openFullButton);

    const closeButton = screen.getByText('Close');
    await user.click(closeButton);

    const modals = screen.queryAllByRole('dialog');
    expect(modals).toHaveLength(0);
  });
});

function setup({
  entryPath = 'header.fields.testField',
  entryValue = {
    input: 'test-input',
    long: BigInt('9007199254740991345435'),
    nested: {
      field: 'nested-value',
    },
  },
  isNegative,
}: {
  entryPath?: string;
  entryValue?: any;
  isNegative?: boolean;
} = {}) {
  const user = userEvent.setup();
  const view = render(
    <WorkflowHistoryGroupDetailsJson
      entryPath={entryPath}
      entryValue={entryValue}
      isNegative={isNegative}
    />
  );
  return { user, ...view };
}
