import React from 'react';

import copy from 'copy-to-clipboard';

import { render, fireEvent, screen, act } from '@/test-utils/rtl';

import CopyTextButton from '../copy-text-button';

jest.mock('copy-to-clipboard', jest.fn);

describe('CopyTextButton', () => {
  const text = 'text to copy';

  it('copies JSON to clipboard', () => {
    render(<CopyTextButton textToCopy={text} />);

    const copyButton = screen.getByRole('button');
    fireEvent.click(copyButton);

    expect(copy).toHaveBeenCalledWith(text);
  });

  it('show tooltip for 1 second and remove it', () => {
    jest.useFakeTimers();

    render(<CopyTextButton textToCopy={text} />);

    const copyButton = screen.getByRole('button');
    fireEvent.click(copyButton);
    const visibleTooltip = screen.getByText('Copied');
    expect(visibleTooltip).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000 + 500); //hide + animation duration
    });

    // Ensure the tooltip is hidden after 1000ms
    const hiddenTooltip = screen.queryByText('Copied');
    expect(hiddenTooltip).not.toBeInTheDocument();

    jest.useRealTimers();
  });
});
