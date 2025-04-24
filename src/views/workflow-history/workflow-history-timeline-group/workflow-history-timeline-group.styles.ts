import { styled as createStyled, type Theme } from 'baseui';
import { type BadgeOverrides } from 'baseui/badge';
import { type StyleObject } from 'styletron-react';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

export const overrides = {
  headerBadge: {
    Badge: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.backgroundSecondary,
        color: $theme.colors.contentSecondary,
        ...$theme.typography.LabelXSmall,
        whiteSpace: 'nowrap',

        [$theme.mediaQuery.medium]: {
          marginTop: 0,
          marginBottom: 0,
        },
      }),
    },
  } satisfies BadgeOverrides,
};

export const styled = {
  VerticalDivider: createStyled<'div', { $hidden?: boolean }>(
    'div',
    ({ $theme, $hidden }: { $theme: Theme; $hidden?: boolean }) => ({
      ...$theme.borders.border200,
      borderColor: $theme.colors.borderOpaque,
      marginLeft: $theme.sizing.scale500,
      ...($hidden && {
        height: 0,
      }),
    })
  ),
};

const cssStylesObj = {
  groupContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  eventHeader: (theme) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.sizing.scale600,
    padding: `${theme.sizing.scale500} 0`,
  }),
  eventLabelAndSecondaryDetails: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    overflow: 'hidden',
    [theme.mediaQuery.medium]: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.sizing.scale200,
    },
    flex: 1,
  }),
  eventSecondaryDetails: (theme) => ({
    display: 'flex',
    gap: theme.sizing.scale200,
    alignItems: 'center',
    flexWrap: 'wrap',
  }),
  eventsLabel: (theme) => ({
    ...theme.typography.LabelMedium,
    flex: 1,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  }),
  eventsTime: (theme) => ({
    ...theme.typography.LabelXSmall,
    color: theme.colors.contentTertiary,
    wordBreak: 'break-word',
  }),
  eventCardContainer: {
    display: 'flex',
    gap: '28px',
  },
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
