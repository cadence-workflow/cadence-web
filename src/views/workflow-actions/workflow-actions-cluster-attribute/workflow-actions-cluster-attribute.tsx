import React, { useMemo } from 'react';

import { Select } from 'baseui/select';

import { styled } from './workflow-actions-cluster-attribute.styles';
import { type Props } from './workflow-actions-cluster-attribute.types';

export default function WorkflowActionsClusterAttribute({
  clusterAttributesByScope,
  value,
  onChange,
  error,
}: Props) {
  const selectedScope = value?.scope || '';

  const scopeOptions = useMemo(() => {
    return Object.keys(clusterAttributesByScope).map((scope) => ({
      id: scope,
      label: scope,
    }));
  }, [clusterAttributesByScope]);

  const nameOptions = useMemo(() => {
    if (!selectedScope) return [];
    const scopeEntry = clusterAttributesByScope[selectedScope];
    if (!scopeEntry) return [];
    return Object.keys(scopeEntry.clusterAttributes).map((name) => ({
      id: name,
      label: name,
    }));
  }, [clusterAttributesByScope, selectedScope]);

  return (
    <styled.Container>
      <Select
        aria-label="Cluster Attribute Scope"
        options={scopeOptions}
        value={selectedScope ? [{ id: selectedScope }] : []}
        onChange={(params) => {
          const newScope = params.value.at(0)?.id?.toString() || '';
          if (newScope) {
            onChange({ scope: newScope, name: '' });
          } else {
            onChange(undefined);
          }
        }}
        size="compact"
        placeholder="Scope"
        clearable
      />
      <Select
        aria-label="Cluster Attribute Name"
        options={nameOptions}
        value={value?.name ? [{ id: value.name }] : []}
        onChange={(params) => {
          const newName = params.value.at(0)?.id?.toString() || '';
          onChange({ scope: selectedScope, name: newName });
        }}
        size="compact"
        placeholder="Name"
        clearable
        disabled={!selectedScope}
        error={error}
      />
    </styled.Container>
  );
}
