import React from 'react';

import { render, screen, fireEvent } from '@/test-utils/rtl';

import SegmentedControlRounded from '../segmented-control-rounded';

describe('SegmentedControlRounded Component', () => {
  const mockOptions = [
    { key: '1', title: 'Option 1' },
    { key: '2', title: 'Option 2' },
    { key: '3', title: 'Option 3' },
  ];

  it('renders the segmented control with options', () => {
    render(
      <SegmentedControlRounded
        activeKey="1"
        onChange={() => {}}
        disabled={false}
        options={mockOptions}
      />
    );

    mockOptions.forEach((option) => {
      expect(screen.getByTitle(option.title)).toBeInTheDocument();
    });
  });

  it('calls onChange when a segment is clicked', () => {
    const handleChange = jest.fn();
    render(
      <SegmentedControlRounded
        activeKey="1"
        onChange={handleChange}
        disabled={false}
        options={mockOptions}
      />
    );

    fireEvent.click(screen.getByTitle('Option 2'));
    expect(handleChange).toHaveBeenCalled();
  });

  it('applies disabled state correctly', () => {
    render(
      <SegmentedControlRounded
        activeKey="1"
        onChange={() => {}}
        disabled={true}
        options={mockOptions}
      />
    );
    const [activeOption, ...inActiveMockOptions] = mockOptions;

    // active option is not disabled
    const segment = screen.getByTitle(activeOption.title);
    expect(segment).not.toHaveAttribute('disabled');

    // inactive options are disabled
    inActiveMockOptions.forEach((option) => {
      const segment = screen.getByTitle(option.title);
      expect(segment).toHaveAttribute('disabled');
    });
  });

  it('renders with correct active key', () => {
    render(
      <SegmentedControlRounded
        activeKey="2"
        onChange={() => {}}
        disabled={false}
        options={mockOptions}
      />
    );
    const activeSegment = screen.getByTitle('Option 2');
    expect(activeSegment).toHaveAttribute('aria-selected', 'true');
  });
});
