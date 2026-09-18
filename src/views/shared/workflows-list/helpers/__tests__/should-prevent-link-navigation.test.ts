import shouldPreventLinkNavigation from '../should-prevent-link-navigation';

const MOUSE_CLICK = { detail: 1 };
const KEYBOARD_CLICK = { detail: 0 };

describe(shouldPreventLinkNavigation.name, () => {
  afterEach(() => {
    window.getSelection()?.removeAllRanges();
    document.body.textContent = '';
  });

  it('returns false when no text is selected', () => {
    expect(shouldPreventLinkNavigation(MOUSE_CLICK)).toBe(false);
  });

  it('returns true when text is selected', () => {
    selectText('selected text');

    expect(shouldPreventLinkNavigation(MOUSE_CLICK)).toBe(true);
  });

  it('returns true for a partial selection such as part of a Run ID', () => {
    selectText('14494f31-2fab-4d02-880a-4c6660bc7f46', 8);

    expect(shouldPreventLinkNavigation(MOUSE_CLICK)).toBe(true);
    expect(window.getSelection()?.toString()).toBe('14494f31');
  });

  it('returns false for a keyboard activation even when text is selected', () => {
    selectText('selected text');

    expect(shouldPreventLinkNavigation(KEYBOARD_CLICK)).toBe(false);
  });
});

function selectText(text: string, endOffset: number = text.length): void {
  const textNode = document.createTextNode(text);
  document.body.appendChild(textNode);

  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, endOffset);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}
