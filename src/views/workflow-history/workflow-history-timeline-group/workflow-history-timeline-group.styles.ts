import { styled as createStyled, type Theme } from 'baseui';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

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
  timelineEventHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px 0',
  },
  timelineEventsLabel: (theme) => ({
    ...theme.typography.LabelLarge,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  }),
  timelineEventsTime: (theme) => ({
    ...theme.typography.LabelXSmall,
    color: theme.colors.contentTertiary,
    wordBreak: 'break-word',
  }),
  timelineEventCardContainer: {
    display: 'flex',
    gap: '28px',
  },
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
