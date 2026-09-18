import shouldPreventLinkNavigation from '../should-prevent-link-navigation';

describe(shouldPreventLinkNavigation.name, () => {
  afterEach(() => {
    window.getSelection()?.removeAllRanges();
  });

  it('returns false when no text is selected', () => {
    expect(shouldPreventLinkNavigation()).toBe(false);
  });

  it('returns true when text is selected', () => {
    const textNode = document.createTextNode('selected text');
    document.body.appendChild(textNode);

    const range = document.createRange();
    range.selectNodeContents(textNode);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    expect(shouldPreventLinkNavigation()).toBe(true);

    document.body.removeChild(textNode);
  });

  it('returns true for a partial selection such as part of a Run ID', () => {
    const runId = document.createTextNode(
      '14494f31-2fab-4d02-880a-4c6660bc7f46'
    );
    document.body.appendChild(runId);

    const range = document.createRange();
    range.setStart(runId, 0);
    range.setEnd(runId, 8);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    expect(shouldPreventLinkNavigation()).toBe(true);
    expect(selection?.toString()).toBe('14494f31');

    document.body.removeChild(runId);
  });
});
