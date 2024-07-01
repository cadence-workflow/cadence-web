import React from 'react';

import { Tag } from 'baseui/tag';
import { MdWarning } from 'react-icons/md';

import { DOMAIN_STATUS_NAMES } from './domain-status-tag.constants';
import { overrides } from './domain-status-tag.styles';
import { type Props } from './domain-status-tag.types';

export default function DomainStatusTag(props: Props) {
  return (
    <Tag closeable={false} overrides={overrides.tag}>
      <MdWarning />
      {DOMAIN_STATUS_NAMES[props.status]}
    </Tag>
  );
}
