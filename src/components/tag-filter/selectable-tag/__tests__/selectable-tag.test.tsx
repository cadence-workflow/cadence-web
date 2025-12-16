import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import SelectableTag from '../selectable-tag';

describe(SelectableTag.name, () => {
  it('renders correctly', () => {
    render(
      <SelectableTag value={false} onClick={jest.fn()}>
        Test Tag
      </SelectableTag>
    );

    expect(screen.getByText('Test Tag')).toBeInTheDocument();
  });
});
