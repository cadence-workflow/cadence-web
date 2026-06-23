import ErrorPanel from '@/components/error-panel/error-panel';

import domainWorkflowsArchivalDisabledPanelConfig from '../config/domain-workflows-archival-disabled-panel.config';

export default function DomainWorkflowsArchivalDisabledPanel() {
  // TODO: Replace with ErrorPanel
  return (
    <ErrorPanel
      message={domainWorkflowsArchivalDisabledPanelConfig.title}
      description={domainWorkflowsArchivalDisabledPanelConfig.description}
      actions={domainWorkflowsArchivalDisabledPanelConfig.links.map(
        ({ text, href }) => ({
          kind: 'link-external',
          label: text,
          link: href,
        })
      )}
    />
  );
  // return (
  //   <PanelSection>
  //     <Image width={64} alt="Error" src={errorIcon} />
  //     <styled.Title>
  //       {domainWorkflowsArchivalDisabledPanelConfig.title}
  //     </styled.Title>
  //     <styled.Content>
  //       {domainWorkflowsArchivalDisabledPanelConfig.details.map(
  //         (detail, index) => (
  //           <styled.Detail key={`details-${index}`}>{detail}</styled.Detail>
  //         )
  //       )}
  //     </styled.Content>
  //     <styled.LinksContainer>
  //       {domainWorkflowsArchivalDisabledPanelConfig.links.map(
  //         ({ text, href }) => (
  //           <styled.LinkContainer key={`link-${href}`}>
  //             <Link href={href} target="_blank" rel="noreferrer">
  //               {text}
  //             </Link>
  //             <MdOpenInNew />
  //           </styled.LinkContainer>
  //         )
  //       )}
  //     </styled.LinksContainer>
  //   </PanelSection>
  // );
}
