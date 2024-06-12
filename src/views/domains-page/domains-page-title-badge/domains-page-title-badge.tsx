'use client';
import React from 'react';

import { Theme } from 'baseui';
import { Badge } from 'baseui/badge';
import { StyleObject } from 'styletron-react';

import { overrides } from './domains-page-title-badge.styles';
import type { Props } from './domains-page-title-badge.types';

export default function DomainsPageTitleBadge({ content }: Props) {
  return <Badge content={content} overrides={overrides.badge} />;
}
