import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';

export const styled = {
  PanelContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    padding: $theme.sizing.scale600,
    backgroundColor: $theme.colors.backgroundSecondary,
    borderRadius: $theme.borders.radius300,
  })),
  PanelHeader: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    gap: $theme.sizing.scale600,
    marginBottom: $theme.sizing.scale700,
  })),
  PanelTitle: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelSmall,
  })),
  InlineWrapper: createStyled('div', {
    position: 'relative',
    width: '100%',
  }),
  InlineContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    padding: $theme.sizing.scale600,
    backgroundColor: $theme.colors.backgroundSecondary,
    borderRadius: $theme.borders.radius300,
    maxHeight: '50vh',
    overflow: 'auto',
  })),
  InlineHeader: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    position: 'absolute',
    right: $theme.sizing.scale400,
    top: $theme.sizing.scale400,
  })),
};

export const overrides = {
  copyButton: {
    BaseButton: {
      style: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
      },
    },
  } satisfies ButtonOverrides,
};
