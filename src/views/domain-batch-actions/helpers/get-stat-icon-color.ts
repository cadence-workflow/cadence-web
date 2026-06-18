import { type Theme } from 'baseui';

export type StatTone = 'positive' | 'warning' | 'neutral';

// Color for a batch-action progress stat icon. Muted stats (a zero count) are
// de-emphasized regardless of tone.
export default function getStatIconColor(
  tone: StatTone,
  muted: boolean,
  theme: Theme
): string {
  if (muted) {
    return theme.colors.contentStateDisabled;
  }
  switch (tone) {
    case 'positive':
      return theme.colors.contentPositive;
    case 'warning':
      return theme.colors.contentWarning;
    case 'neutral':
      return theme.colors.contentPrimary;
  }
}
