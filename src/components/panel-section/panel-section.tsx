import { styled } from './panel-section.styles';
import { type Props } from './panel-section.types';

export default function PanelSection({ children }: Props) {
  return (
    <styled.PanelSectionContainer>
      <styled.Spacer $height="40%" />
      {children}
      <styled.Spacer $height="60%" />
    </styled.PanelSectionContainer>
  );
}
