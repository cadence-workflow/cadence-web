import type { Breakpoints } from 'baseui/themes';

const getMediaQuery = (breakpoint: number): string =>
  `@media screen and (min-width: ${breakpoint}px)`;

export const getMediaQueriesForBreakpoints = (
  breakpoints: Breakpoints
): string[] =>
  Object.keys(breakpoints)
    .map((key) => breakpoints[key as keyof Breakpoints])
    .sort((a, b) => a - b)
    .map(getMediaQuery);
