import React from 'react';
import type { DomainInfo } from '../domain-page.types';

type LoadingProps = {
  loading: true;
};

type LoadedProps = {
  loading: false;
  domainInfo: DomainInfo;
  cluster: string;
};

export type Props = LoadingProps | LoadedProps;

export type DomainHeaderInfoItemContentProps = {
  domainInfo: DomainInfo;
  cluster: string;
};

interface InfoItemBase {
  title: string;
  placeholderSize: string;
}

interface InfoItemComponent extends InfoItemBase {
  component: React.ComponentType<DomainHeaderInfoItemContentProps>;
  getLabel?: never;
}

interface InfoItemLabel extends InfoItemBase {
  getLabel: (props: DomainHeaderInfoItemContentProps) => string;
  component?: never;
}

export type DomainPageHeaderInfoItemConfig = InfoItemComponent | InfoItemLabel;

export type DomainPageHeaderInfoItemsConfig =
  Array<DomainPageHeaderInfoItemConfig>;
