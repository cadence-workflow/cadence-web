import isStyleColorName from './style.helpers';
import { styled } from './style.styles';
import { type StyleProps } from './style.types';

export default function Style({ color, bg, children }: StyleProps) {
  return (
    <styled.Span
      $color={isStyleColorName(color) ? color : undefined}
      $bg={isStyleColorName(bg) ? bg : undefined}
    >
      {children}
    </styled.Span>
  );
}
