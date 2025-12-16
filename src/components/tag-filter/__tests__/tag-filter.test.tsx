import { render, screen, userEvent } from '@/test-utils/rtl';

import TagFilter from '../tag-filter';
import { type TagFilterOptionConfig } from '../tag-filter.types';

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
  it('renders label, "Show all" tag, and all tags from optionsConfig with enhancers', () => {
    setup({});

    expect(screen.getByText('Mock Label')).toBeInTheDocument();
    expect(screen.getByText('Show all')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
    expect(screen.getByTestId('enhancer-opt1')).toBeInTheDocument();
    expect(screen.queryByTestId('enhancer-opt2')).not.toBeInTheDocument();
    expect(screen.getByTestId('enhancer-opt3')).toBeInTheDocument();
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

  it('clears all selections when "Show all" is clicked and no values are currently selected', async () => {
    const { user, mockOnChangeValues } = setup({
      values: [],
    });

    const showAllTag = screen.getByText('Show all');
    await user.click(showAllTag);

    expect(mockOnChangeValues).toHaveBeenCalledWith([]);
  });

  it('clears all selections when "Show all" is clicked and all values are currently selected', async () => {
    const { user, mockOnChangeValues } = setup({
      values: ['opt1', 'opt2', 'opt3'],
    });

    const showAllTag = screen.getByText('Show all');
    await user.click(showAllTag);

    expect(mockOnChangeValues).toHaveBeenCalledWith([]);
  });

  it('clears all selections when "Show all" is clicked and only some values are currently selected', async () => {
    const { user, mockOnChangeValues } = setup({
      values: ['opt1'],
    });

    const showAllTag = screen.getByText('Show all');
    await user.click(showAllTag);

    expect(mockOnChangeValues).toHaveBeenCalledWith([]);
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
