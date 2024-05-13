import { getMediaQueriesForBreakpoints } from '../get-media-queries-for-breakpoints';

describe('getMediaQueriesForBreakpoints', () => {
  it('should return an array of media queries sorted in ascending order', () => {
    const breakpoints = {
      small: 480,
      medium: 768,
      large: 1024,
    };
    const expectedMediaQueries = [
      '@media screen and (min-width: 480px)',
      '@media screen and (min-width: 768px)',
      '@media screen and (min-width: 1024px)',
    ];
    expect(getMediaQueriesForBreakpoints(breakpoints)).toEqual(
      expectedMediaQueries
    );
  });
});
