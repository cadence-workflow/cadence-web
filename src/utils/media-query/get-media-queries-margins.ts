import type { Theme } from 'baseui';
import type { StyleObject } from 'styletron-react';
import { getMediaQueriesForBreakpoints } from './get-media-queries-for-breakpoints';

const defaultCreateMargins = (margin: number): StyleObject => ({
  marginRight: `${margin}px`,
  marginLeft: `${margin}px`,
});

export function getMediaQueryMargins(
  theme: {
    breakpoints: Theme['breakpoints'];
    grid: Pick<Theme['grid'], 'margins'>;
  },
  createStyles: (margin: number) => StyleObject = defaultCreateMargins
) {
  const result = {} as {
    [key: string]: StyleObject;
  };
  const mediaQueries = getMediaQueriesForBreakpoints(theme.breakpoints);
  for (const [index, query] of Object.entries(mediaQueries)) {
    // There is no guarantee grid.margins will have enough margins to satisfy
    // each breakpoint.
    const margin = Array.isArray(theme.grid.margins)
      ? theme.grid.margins[parseInt(index)] ?? theme.grid.margins.at(-1)
      : theme.grid.margins;

    result[query] = createStyles(margin);
  }
  return result;
}
