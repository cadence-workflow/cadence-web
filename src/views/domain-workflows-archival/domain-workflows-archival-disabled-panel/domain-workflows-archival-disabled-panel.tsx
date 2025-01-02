import Image from 'next/image';

import errorIcon from '@/assets/error-icon.svg';

import { styled } from './domain-workflows-archival-disabled-panel.styles';

export default function DomainWorkflowsArchivalDisabledPanel() {
  return (
    <styled.PanelContainer>
      <styled.TopSpacer />
      <Image width={64} height={64} alt="Error" src={errorIcon} />
      <styled.Title>Archival not enabled for domain</styled.Title>
      <styled.Content>
        <styled.Subtitle>
          This domain currently does not have history archival and/or visibility
          archival enabled.
        </styled.Subtitle>
        <styled.Subtitle>
          To enable the Cadence UI archival screen you will need to enable both
          history archival and visibility archival.
        </styled.Subtitle>
      </styled.Content>
      <styled.BottomSpacer />
    </styled.PanelContainer>
  );
}
