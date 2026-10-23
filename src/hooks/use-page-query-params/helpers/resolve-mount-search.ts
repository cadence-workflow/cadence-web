import isSameSearch from './is-same-search';
import readWindowSearch from './read-window-search';

export default function resolveMountSearch(
  routePathname: string | null,
  nextSearch: string
): string {
  const locationSearch = readWindowSearch();
  const shouldReadLocation =
    window.location.pathname === routePathname && window.history.state === null;

  return shouldReadLocation && !isSameSearch(locationSearch, nextSearch)
    ? locationSearch
    : nextSearch;
}
