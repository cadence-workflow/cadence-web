import { getMediaQueryMargins } from '../get-media-queries-margins'; // Assuming the function is in a separate file

describe('getMediaQueryMargins', () => {
  // Mock theme object with breakpoints and grid margins
  const theme = {
    breakpoints: {
      small: 480,
      medium: 768,
      large: 1024,
    },
    grid: {
      margins: [5, 10, 15],
    },
  };

  it('should return media query margins for each breakpoint using default createStyles', () => {
    const result = getMediaQueryMargins(theme);
    expect(result).toEqual({
      '@media screen and (min-width: 480px)': {
        marginRight: '5px',
        marginLeft: '5px',
      },
      '@media screen and (min-width: 768px)': {
        marginRight: '10px',
        marginLeft: '10px',
      },
      '@media screen and (min-width: 1024px)': {
        marginRight: '15px',
        marginLeft: '15px',
      },
    });
  });

  it('should return media query margins for each breakpoint using custom createStyles', () => {
    // Custom createStyles function that adds a custom property
    const customCreateStyles = (margin: number) => ({
      marginRight: `${margin}px`,
      marginLeft: `${margin}px`,
      paddingTop: '5px', // Custom property
    });

    const result = getMediaQueryMargins(theme, customCreateStyles);
    expect(result).toEqual({
      '@media screen and (min-width: 480px)': {
        marginRight: '5px',
        marginLeft: '5px',
        paddingTop: '5px',
      },
      '@media screen and (min-width: 768px)': {
        marginRight: '10px',
        marginLeft: '10px',
        paddingTop: '5px',
      },
      '@media screen and (min-width: 1024px)': {
        marginRight: '15px',
        marginLeft: '15px',
        paddingTop: '5px',
      },
    });
  });
});
