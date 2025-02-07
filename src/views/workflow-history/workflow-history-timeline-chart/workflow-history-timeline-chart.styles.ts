import { styled as createStyled, withStyle, type Theme } from 'baseui';
import { Spinner } from 'baseui/spinner';
import { type TagOverrides } from 'baseui/tag';
import { type StyleObject } from 'styletron-react';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

// Colours
const waiting = (theme: Theme) => ({
  backgroundColor: `${theme.colors.backgroundSecondary} !important`,
  borderColor: `${theme.colors.contentPrimary} !important`,
});

const completed = (_: Theme) => ({
  backgroundColor: '#D3EFDA !important',
  borderColor: '#009A51 !important',
});

const negative = (theme: Theme) => ({
  backgroundColor: '#FFE1DE !important',
  borderColor: `${theme.colors.negative} !important`,
});

const ongoing = (theme: Theme) => ({
  backgroundColor: '#DEE9FE !important',
  borderColor: `${theme.colors.accent} !important`,
});

// Items
const timer = (_: Theme) => ({
  paddingInline: '2px',
  borderWidth: '0 2px !important',
  borderRadius: '0 !important',
});

const regular = (theme: Theme) => ({
  color: `${theme.colors.contentPrimary} !important`,
  paddingInline: '2px',
  borderRadius: `${theme.sizing.scale300} !important`,
});

const single = (theme: Theme, selected?: boolean) => ({
  color: `${theme.colors.contentPrimary} !important`,
  paddingInline: '2px',
  borderRadius: theme.sizing.scale500,
  ...(selected ? {} : { backgroundColor: 'unset' }),
});

const selected = (
  theme: Theme,
  color: (theme: Theme) => { backgroundColor: string; borderColor: string },
  kind: 'regular' | 'single' | 'timer' = 'regular'
) => {
  const unselectedStyle = color(theme);

  let borderColor: string;
  switch (kind) {
    case 'single':
      borderColor = `${theme.colors.contentInversePrimary} !important`;
      break;
    case 'timer':
    case 'regular':
    default:
      borderColor = unselectedStyle.borderColor;
      break;
  }

  return {
    color: `${theme.colors.contentInversePrimary} !important`,
    borderColor,
    backgroundColor: unselectedStyle.borderColor,
  };
};

const cssStylesObj = {
  timerWaiting: (theme) => ({
    ...timer(theme),
    ...waiting(theme),
  }),
  timerCompleted: (theme) => ({
    ...timer(theme),
    ...completed(theme),
  }),
  timerNegative: (theme) => ({
    ...timer(theme),
    ...negative(theme),
  }),
  regularCompleted: (theme) => ({
    ...regular(theme),
    ...completed(theme),
  }),
  regularOngoing: (theme) => ({
    ...regular(theme),
    ...ongoing(theme),
  }),
  regularNegative: (theme) => ({
    ...regular(theme),
    ...negative(theme),
  }),
  regularWaiting: (theme) => ({
    ...regular(theme),
    ...waiting(theme),
  }),
  singleCompleted: (theme) => ({
    ...single(theme),
    ...completed(theme),
  }),
  singleNegative: (theme) => ({
    ...single(theme),
    ...negative(theme),
  }),
  timerWaitingSelected: (theme) => ({
    ...timer(theme),
    ...selected(theme, waiting, 'timer'),
  }),
  timerCompletedSelected: (theme) => ({
    ...timer(theme),
    ...selected(theme, completed, 'timer'),
  }),
  timerNegativeSelected: (theme) => ({
    ...timer(theme),
    ...selected(theme, negative, 'timer'),
  }),
  regularCompletedSelected: (theme) => ({
    ...regular(theme),
    ...selected(theme, completed),
  }),
  regularOngoingSelected: (theme) => ({
    ...regular(theme),
    ...selected(theme, ongoing),
  }),
  regularNegativeSelected: (theme) => ({
    ...regular(theme),
    ...selected(theme, negative),
  }),
  regularWaitingSelected: (theme) => ({
    ...regular(theme),
    ...selected(theme, waiting),
  }),
  singleCompletedSelected: (theme) => ({
    ...single(theme, true),
    ...selected(theme, completed, 'single'),
  }),
  singleNegativeSelected: (theme) => ({
    ...single(theme, true),
    ...selected(theme, negative, 'single'),
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;

export const styled = {
  TimelineContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    marginTop: $theme.sizing.scale500,
    marginBottom: $theme.sizing.scale500,
    position: 'relative',
    zIndex: 0,
  })),
  LoaderContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    position: 'absolute',
    top: $theme.sizing.scale400,
    right: $theme.sizing.scale400,
    zIndex: 2,
  })),
  Spinner: withStyle(Spinner, ({ $theme }) => ({
    width: $theme.sizing.scale500,
    height: $theme.sizing.scale500,
    borderWidth: '2px',
    marginRight: '1px',
    borderTopColor: $theme.colors.contentInversePrimary,
    borderRightColor: $theme.colors.accent200,
    borderLeftColor: $theme.colors.accent200,
    borderBottomColor: $theme.colors.accent200,
  })),
};

export const overrides = {
  tag: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        borderRadius: $theme.borders.radius200,
      }),
    },
  } satisfies TagOverrides,
};
