import { type Theme } from 'baseui';
import { type AccordionOverrides } from 'baseui/accordion';
import { type SkeletonOverrides } from 'baseui/skeleton/types';
import { type StyleObject } from 'styletron-react';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

import getBadgeContainerSize from '../workflow-history-event-status-badge/helpers/get-badge-container-size';

export const overrides = {
  circularSkeleton: {
    Root: {
      style: {
        borderRadius: '50%',
      },
    },
  } satisfies SkeletonOverrides,
  accordion: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.borders.border100,
        borderRadius: $theme.borders.radius300,
        overflow: 'hidden',
      }),
    },
    Header: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        gap: $theme.sizing.scale500,
        paddingTop: $theme.sizing.scale400,
        paddingRight: $theme.sizing.scale600,
        paddingBottom: $theme.sizing.scale400,
        paddingLeft: $theme.sizing.scale500,
      }),
    },
    ToggleIcon: {
      style: ({
        $theme,
        $disabled,
      }: {
        $theme: Theme;
        $disabled: boolean;
      }): StyleObject => ({
        height: $theme.sizing.scale600,
        width: $theme.sizing.scale600,
        ...($disabled && { opacity: 0 }),
      }),
    },
    PanelContainer: {
      style: {
        ':last-child': {
          borderBottomWidth: 0,
        },
      },
    },
    Content: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        maxHeight: '70vh',
        overflow: 'auto',
        // align content with the panel label by assigning it the value of: header padding + statusIcon + gap between icon and header label
        paddingLeft: `calc(${getBadgeContainerSize($theme, 'small')} + ${$theme.sizing.scale500} + ${$theme.sizing.scale500})`,
        paddingTop: `0px`,
        paddingBottom: $theme.sizing.scale400,
      }),
    },
  } satisfies AccordionOverrides,
};

const cssStylesObj = {
  eventLabel: ($theme: Theme) => ({
    ...$theme.typography.LabelSmall,
    color: $theme.colors.contentPrimary,
    flex: 1,
  }),
  skeletonContainer: ($theme: Theme) => ({
    display: 'flex',
    alignItems: 'center',
    gap: $theme.sizing.scale500,
  }),

  detailsRow: (theme) => ({
    display: 'flex',
    flexDirection: 'row',
    gap: theme.sizing.scale300,
    flexWrap: 'wrap',
    paddingTop: theme.sizing.scale200,
    paddingBottom: theme.sizing.scale200,
    wordBreak: 'break-word',
  }),
  detailsLabel: (theme) => ({
    minWidth: '150px',
    maxWidth: '150px',
    display: 'flex',
    color: theme.colors.contentTertiary,
    ...theme.typography.LabelXSmall,
  }),
  detailsValue: (theme) => ({
    color: theme.colors.contentPrimary,
    ...theme.typography.LabelXSmall,
    display: 'flex',
    flex: '1 0 300px',
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
