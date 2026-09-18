// A drag-to-select leaves a non-empty selection at click time; a plain click
// collapses it. Checking this native state is enough to tell them apart.
// Keyboard and assistive-technology activation dispatch a click with
// `detail === 0` without collapsing any existing selection, so they must stay
// navigable regardless of what is selected on the page.
export default function shouldPreventLinkNavigation(event: {
  detail: number;
}): boolean {
  return event.detail > 0 && Boolean(window.getSelection()?.toString());
}
