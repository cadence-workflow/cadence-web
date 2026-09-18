// A drag-to-select leaves a non-empty selection at click time; a plain click
// collapses it. Checking this native state is enough to tell them apart.
export default function shouldPreventLinkNavigation(): boolean {
  return Boolean(window.getSelection()?.toString());
}
