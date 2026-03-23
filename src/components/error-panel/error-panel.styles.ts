import { styled as createStyled, type Theme } from 'baseui';
import type { BannerOverrides } from 'baseui/banner';

export const styled = {
  ErrorContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: $theme.sizing.scale600,
    padding: `${$theme.sizing.scale900} ${$theme.sizing.scale600}`,
  })),
  ErrorText: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.HeadingXSmall,
  })),
  ErrorActionsContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: $theme.sizing.scale300,
      paddingTop: $theme.sizing.scale100,
    })
  ),
  ErrorMessageToggle: createStyled(
    'button',
    ({ $theme }: { $theme: Theme }) => ({
      display: 'flex',
      alignItems: 'center',
      gap: $theme.sizing.scale100,
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      color: $theme.colors.contentPrimary,
      ...$theme.typography.LabelSmall,
    })
  ),
  ErrorMessageContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      display: 'flex',
      alignItems: 'flex-start',
      gap: $theme.sizing.scale300,
      marginTop: $theme.sizing.scale600,
      padding: $theme.sizing.scale600,
      backgroundColor: $theme.colors.backgroundPrimary,
      borderRadius: $theme.borders.radius300,
      ...$theme.typography.MonoParagraphXSmall,
      color: $theme.colors.contentNegative,
    })
  ),
  ErrorMessageText: createStyled('div', () => ({
    overflowY: 'auto',
    maxHeight: '160px',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  })),
  ErrorCopyButtonContainer: createStyled('div', () => ({
    flexShrink: 0,
  })),
};

export const overrides = {
  banner: {
    Root: {
      style: {
        width: 'min(600px, 100%)',
        marginLeft: 0,
        marginRight: 0,
      },
    },
  } satisfies BannerOverrides,
};
