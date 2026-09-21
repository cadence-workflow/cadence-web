// A drag-to-select ends as a click with text still selected; a plain click
// collapses it. detail > 0 keeps keyboard clicks (detail === 0) navigable.
// https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail
export default function shouldPreventLinkNavigation(event: {
  detail: number;
}): boolean {
  return event.detail > 0 && Boolean(window.getSelection()?.toString());
}
