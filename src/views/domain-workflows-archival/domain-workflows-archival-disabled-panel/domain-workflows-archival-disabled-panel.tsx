import Image from 'next/image';
import { MdOpenInNew } from 'react-icons/md';

import errorIcon from '@/assets/error-icon.svg';
import Link from '@/components/link/link';
import PanelSection from '@/components/panel-section/panel-section';

import domainWorkflowsArchivalDisabledPanelConfig from '../config/domain-workflows-archival-disabled-panel.config';

import { styled } from './domain-workflows-archival-disabled-panel.styles';

export default function DomainWorkflowsArchivalDisabledPanel() {
  return (
    <PanelSection heightPercent={35}>
      <Image width={64} height={64} alt="Error" src={errorIcon} />
      <styled.Title>
        {domainWorkflowsArchivalDisabledPanelConfig.title}
      </styled.Title>
      <styled.Content>
        {domainWorkflowsArchivalDisabledPanelConfig.details.map(
          (detail, index) => (
            <styled.Detail key={`details-${index}`}>{detail}</styled.Detail>
          )
        )}
      </styled.Content>
      <styled.LinksContainer>
        {domainWorkflowsArchivalDisabledPanelConfig.links.map(
          ({ text, href }) => (
            <styled.LinkContainer key={`link-${href}`}>
              <Link href={href} target="_blank" rel="noreferrer">
                {text}
              </Link>
              <MdOpenInNew />
            </styled.LinkContainer>
          )
        )}
      </styled.LinksContainer>
    </PanelSection>
  );
}
