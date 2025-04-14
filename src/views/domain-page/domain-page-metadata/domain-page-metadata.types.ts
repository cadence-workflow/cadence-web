import { type DomainDescription } from '../domain-page.types';

export type GetMetadataValueProps = {
  domainDescription: DomainDescription;
};

type MetadataLinkValue = {
  text: string;
  href: string;
};

interface MetadataItem<T> {
  key: string;
  label: string;
  kind: 'text' | 'link' | 'custom';
  description?: string;
  getValue: (domainDescription: DomainDescription) => T;
}

interface MetadataTextItem extends MetadataItem<string> {
  kind: 'text';
}

interface MetadataLinkItem extends MetadataItem<MetadataLinkValue> {
  kind: 'link';
}

interface MetadataCustomItem extends MetadataItem<React.ReactNode> {
  kind: 'custom';
}

type MetadataGroupItem = Omit<
  MetadataTextItem | MetadataLinkItem | MetadataCustomItem,
  'description'
>;

export type MetadataGroup = {
  kind: 'group';
  key: string;
  label: string;
  description?: string;
  items: Array<MetadataGroupItem>;
};

export type MetadataField =
  | MetadataTextItem
  | MetadataLinkItem
  | MetadataCustomItem
  | MetadataGroup;
