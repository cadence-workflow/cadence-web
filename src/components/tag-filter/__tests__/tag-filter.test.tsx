import { render, screen, userEvent } from '@/test-utils/rtl';

import TagFilter from '../tag-filter';
import { type TagFilterOptionConfig } from '../tag-filter.types';

jest.mock('../selectable-tag/selectable-tag', () =>
  jest.fn(({ value, onClick, children, startEnhancer }) => (
    <button
      data-testid={`selectable-tag-${children}`}
      data-selected={value}
      onClick={onClick}
    >
      {startEnhancer && startEnhancer()}
      {children}
    </button>
  ))
);

const MOCK_OPTIONS_CONFIG = {
  opt1: {
    label: 'Option 1',
    startEnhancer: () => <div data-testid="enhancer-opt1" />,
  },
  opt2: {
    label: 'Option 2',
  },
  opt3: {
    label: 'Option 3',
    startEnhancer: () => <div data-testid="enhancer-opt3" />,
  },
} as const satisfies Record<string, TagFilterOptionConfig>;

type MockOption = keyof typeof MOCK_OPTIONS_CONFIG;

describe(TagFilter.name, () => {
  it('renders without errors', () => {
    setup({});

    expect(screen.getByText('Mock Label')).toBeInTheDocument();
    expect(screen.getByText('Show all')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('renders all tags from optionsConfig', () => {
    setup({});

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
    expect(screen.getByTestId('enhancer-opt1')).toBeInTheDocument();
    expect(screen.queryByTestId('enhancer-opt2')).not.toBeInTheDocument();
    expect(screen.getByTestId('enhancer-opt3')).toBeInTheDocument();
  });

  it('renders "Show all" tag', () => {
    setup({});

    expect(screen.getByText('Show all')).toBeInTheDocument();
  });

  it('calls onChangeValues when clicking an individual tag to select it', async () => {
    const { user, mockOnChangeValues } = setup({
      values: [],
    });

    const option1Tag = screen.getByText('Option 1');
    await user.click(option1Tag);

    expect(mockOnChangeValues).toHaveBeenCalledWith(['opt1']);
  });

  it('calls onChangeValues when clicking an individual tag to deselect it', async () => {
    const { user, mockOnChangeValues } = setup({
      values: ['opt1', 'opt2'],
    });

    const option1Tag = screen.getByText('Option 1');
    await user.click(option1Tag);

    expect(mockOnChangeValues).toHaveBeenCalledWith(['opt2']);
  });

  it('calls onChangeValues with all tag keys when clicking "Show all" and no values are selected', async () => {
    const { user, mockOnChangeValues } = setup({
      values: [],
    });

    const showAllTag = screen.getByText('Show all');
    await user.click(showAllTag);

    expect(mockOnChangeValues).toHaveBeenCalledWith(['opt1', 'opt2', 'opt3']);
  });

  it('calls onChangeValues with empty array when clicking "Show all" and all values are selected', async () => {
    const { user, mockOnChangeValues } = setup({
      values: ['opt1', 'opt2', 'opt3'],
    });

    const showAllTag = screen.getByText('Show all');
    await user.click(showAllTag);

    expect(mockOnChangeValues).toHaveBeenCalledWith([]);
  });

  it('calls onChangeValues with all tag keys when clicking "Show all" and only some values are selected', async () => {
    const { user, mockOnChangeValues } = setup({
      values: ['opt1'],
    });

    const showAllTag = screen.getByText('Show all');
    await user.click(showAllTag);

    expect(mockOnChangeValues).toHaveBeenCalledWith(['opt1', 'opt2', 'opt3']);
  });

  it('handles empty values array', () => {
    setup({
      values: [],
    });

    expect(screen.getByText('Show all')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('handles all values selected', () => {
    setup({
      values: ['opt1', 'opt2', 'opt3'],
    });

    expect(screen.getByText('Show all')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('handles partial selection', () => {
    setup({
      values: ['opt1', 'opt3'],
    });

    expect(screen.getByText('Show all')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('does not render "Show all" tag when hideShowAll is true', () => {
    setup({
      hideShowAll: true,
    });

    expect(screen.queryByText('Show all')).not.toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });
});

function setup({
  label = 'Mock Label',
  values = [],
  optionsConfig = MOCK_OPTIONS_CONFIG,
  hideShowAll = false,
}: {
  label?: string;
  values?: Array<MockOption>;
  optionsConfig?: Record<MockOption, TagFilterOptionConfig>;
  hideShowAll?: boolean;
} = {}) {
  const mockOnChangeValues = jest.fn();
  const user = userEvent.setup();

  render(
    <TagFilter
      label={label}
      values={values}
      onChangeValues={mockOnChangeValues}
      optionsConfig={optionsConfig}
      hideShowAll={hideShowAll}
    />
  );

  return { user, mockOnChangeValues };
}
