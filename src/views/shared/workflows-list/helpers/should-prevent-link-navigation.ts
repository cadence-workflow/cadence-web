export default function shouldPreventLinkNavigation(event: {
  detail: number;
}): boolean {
  return event.detail > 0 && Boolean(window.getSelection()?.toString());
}
