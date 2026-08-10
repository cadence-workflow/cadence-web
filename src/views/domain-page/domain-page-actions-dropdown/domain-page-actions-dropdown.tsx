'use client';
import React from 'react';

import { StatefulPopover } from 'baseui/popover';
import { MdArrowDropDown } from 'react-icons/md';

import CustomButton from '@/components/button/button';

import domainPageActionsConfig from '../config/domain-page-actions.config';

import { styled, overrides } from './domain-page-actions-dropdown.styles';
import type {
  DomainPageActionConfig,
  Props,
} from './domain-page-actions-dropdown.types';

export default function DomainPageActionsDropdown({ domain, cluster }: Props) {
  return (
    <StatefulPopover
      placement="bottomLeft"
      overrides={overrides.popover}
      content={({ close }) => (
        <styled.MenuItemsContainer>
          {domainPageActionsConfig.map((action: DomainPageActionConfig) => (
            <action.actionButton
              key={action.id}
              domain={domain}
              cluster={cluster}
              label={action.label}
              icon={action.icon}
              onCloseMenu={close}
            />
          ))}
        </styled.MenuItemsContainer>
      )}
      returnFocus
      autoFocus
    >
      <CustomButton
        size="compact"
        kind="secondary"
        endEnhancer={<MdArrowDropDown size={16} />}
        loadingIndicatorType="skeleton"
      >
        Domain actions
      </CustomButton>
    </StatefulPopover>
  );
}
