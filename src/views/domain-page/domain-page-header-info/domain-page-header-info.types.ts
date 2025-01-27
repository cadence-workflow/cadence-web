import type React from 'react';

import { type DomainPageContextType } from '../domain-page-context-provider/domain-page-context-provider.types';
import type { DomainInfo } from '../domain-page.types';

type LoadingProps = {
  loading: true;
};

type LoadedProps = {
  loading: false;
  domainInfo: DomainInfo | null;
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
  getLabel: (
    props: DomainHeaderInfoItemContentProps,
    pageCtx: DomainPageContextType
  ) => string;
  component?: never;
}

export type DomainPageHeaderInfoItemConfig = InfoItemComponent | InfoItemLabel;

export type DomainPageHeaderInfoItemsConfig =
  Array<DomainPageHeaderInfoItemConfig>;
