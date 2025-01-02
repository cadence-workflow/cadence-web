import { styled } from './panel-section.styles';
import { type Props } from './panel-section.types';

export default function PanelSection({ children, heightPercent }: Props) {
  return (
    <styled.PanelContainer>
      <styled.Spacer $heightPercent={heightPercent} />
      {children}
      <styled.Spacer $heightPercent={100 - heightPercent} />
    </styled.PanelContainer>
  );
}
