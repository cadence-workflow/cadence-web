'use client';
import React from 'react';

import Image from 'next/image';

import cadenceIcon from '@/assets/cadence-logo.svg';
import Link from '@/components/link/link';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import type { DomainData } from '@/views/domains-page/domains-page.types';
import getDefaultClusterForActiveActiveDomain from '@/views/shared/active-active/helpers/get-default-cluster-for-active-active-domain';
import isActiveActiveDomain from '@/views/shared/active-active/helpers/is-active-active-domain';
import DomainStatusTag from '@/views/shared/domain-status-tag/domain-status-tag';

import { cssStyles } from './domains-table-domain-name-cell.styles';

function DomainsTableDomainNameCell(props: DomainData) {
  const { cls } = useStyletronClasses(cssStyles);

  const clusterName = isActiveActiveDomain(props)
    ? getDefaultClusterForActiveActiveDomain(props)
    : props.activeClusterName;

  return (
    <div className={cls.domainNameCell}>
      <Image width={16} height={16} alt="Cadence Icon" src={cadenceIcon} />
      <Link href={`/domains/${props.name}/${clusterName}`}>{props.name}</Link>
      {props.status !== 'DOMAIN_STATUS_REGISTERED' && (
        <DomainStatusTag status={props.status} />
      )}
    </div>
  );
}

export default DomainsTableDomainNameCell;
