import { useState } from 'react';

import { Button, type ButtonProps } from 'baseui/button';
import Link from 'next/link';
import { MdOpenInNew } from 'react-icons/md';

import { overrides, styled } from './domain-page-help-item-button.styles';
import { type DomainPageHelpItem } from './domain-page-help-item-button.types';

export default function DomainPageHelpItemButton(item: DomainPageHelpItem) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const baseButtonProps: ButtonProps = {
    kind: 'tertiary',
    size: 'compact',
    overrides: overrides.button,
    startEnhancer: item.icon,
  };

  if (item.kind === 'link') {
    return (
      <Button
        {...baseButtonProps}
        $as={Link}
        target="_blank"
        rel="noreferrer"
        href={item.href}
      >
        <styled.ExternalLinkButtonContent>
          {item.text}
          <MdOpenInNew />
        </styled.ExternalLinkButtonContent>
      </Button>
    );
  }

  if (item.kind === 'modal') {
    return (
      <>
        <Button {...baseButtonProps} onClick={() => setIsModalOpen(true)}>
          {item.text}
        </Button>
        <item.modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  return (
    <Button {...baseButtonProps} onClick={item.onClick}>
      {item.text}
    </Button>
  );
}
