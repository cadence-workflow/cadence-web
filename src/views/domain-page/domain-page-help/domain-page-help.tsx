import { Button } from 'baseui/button';
import { StatefulPopover } from 'baseui/popover';
import { MdArrowDropDown, MdSupport } from 'react-icons/md';

import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';

import domainPageHelpMenuConfig from '../config/domain-page-help-menu.config';
import DomainPageHelpItemButton from '../domain-page-help-item-button/domain-page-help-item-button';

import { overrides, styled } from './domain-page-help.styles';
import { type DomainPageHelpGroup } from './domain-page-help.types';

export default function DomainPageHelp() {
  const {
    data: { metadata: isExtendedMetadataEnabled },
  } = useSuspenseConfigValue('EXTENDED_DOMAIN_INFO_ENABLED');

  if (!isExtendedMetadataEnabled) return null;

  return (
    <StatefulPopover
      placement="bottomRight"
      overrides={overrides.popover}
      content={
        <>
          {domainPageHelpMenuConfig.map((group: DomainPageHelpGroup) => (
            <styled.HelpMenuGroup key={group.title}>
              <styled.HelpMenuGroupTitle>
                {group.title}
              </styled.HelpMenuGroupTitle>
              {group.items.map((item) => (
                <DomainPageHelpItemButton key={item.text} {...item} />
              ))}
            </styled.HelpMenuGroup>
          ))}
        </>
      }
    >
      <Button
        size="compact"
        kind="secondary"
        startEnhancer={<MdSupport size={16} />}
        endEnhancer={<MdArrowDropDown size={16} />}
      >
        Help
      </Button>
    </StatefulPopover>
  );
}
