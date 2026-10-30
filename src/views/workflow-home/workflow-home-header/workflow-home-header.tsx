'use client';
import React from 'react';

import { Button } from 'baseui/button';
import { MdRefresh } from 'react-icons/md';

import { overrides, styled } from './workflow-home-header.styles';
import { type Props } from './workflow-home-header.types';

export default function WorkflowHomeHeader({
  title,
  onRefresh,
  isRefreshing,
}: Props) {
  return (
    <styled.Header>
      {title ? <styled.Title>{title}</styled.Title> : <div />}
      <Button
        size="compact"
        kind="secondary"
        shape="pill"
        startEnhancer={<MdRefresh size={16} />}
        isLoading={isRefreshing}
        onClick={onRefresh}
        overrides={overrides.refreshButton}
      >
        Refresh
      </Button>
    </styled.Header>
  );
}
