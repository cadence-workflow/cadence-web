'use client';
import React from 'react';
import Image from 'next/image';
import cadenceIcon from '@/assets/cadence-logo.svg';

import type { DomainData } from '@/views/domains-page/domains-page.types';
import TableLink from '@/views/domains-page/domains-table-link/domains-table-link';

import useStyletronClasses from '@/hooks/use-styletron-classes';
import { cssStyles } from './domains-table-domain-name-cell.styles';

function DomainsTableDomainNameCell(props: DomainData) {
  const { cls } = useStyletronClasses(cssStyles);

  return (
    <div className={cls.domainNameCell}>
      <Image width={16} height={16} alt="Cadence Icon" src={cadenceIcon} />
      <TableLink href={'a'}>{props.name}</TableLink>
    </div>
  );
}

export default DomainsTableDomainNameCell;
