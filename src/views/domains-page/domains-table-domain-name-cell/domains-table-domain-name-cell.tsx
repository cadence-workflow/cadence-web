'use client';
import React from 'react';

import Image from 'next/image';

import cadenceIcon from '@/assets/cadence-logo.svg';
import LinkBlack from '@/components/link-black/link-black';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import type { DomainData } from '@/views/domains-page/domains-page.types';

import { cssStyles } from './domains-table-domain-name-cell.styles';

function DomainsTableDomainNameCell(props: DomainData) {
  const { cls } = useStyletronClasses(cssStyles);

  return (
    <div className={cls.domainNameCell}>
      <Image width={16} height={16} alt="Cadence Icon" src={cadenceIcon} />
      <LinkBlack href={`/domains/${props.name}/${props.activeClusterName}`}>
        {props.name}
      </LinkBlack>
    </div>
  );
}

export default DomainsTableDomainNameCell;
