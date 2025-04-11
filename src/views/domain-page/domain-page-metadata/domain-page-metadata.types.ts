import { type DomainMetadata } from '../hooks/use-suspense-domain-page-metadata.types';

interface MetadataItem<T> {
  key: string;
  label: string;
  kind: 'text' | 'custom';
  description?: string;
  getValue: (metadata: DomainMetadata) => T;
}

export interface MetadataTextItem extends MetadataItem<string> {
  kind: 'text';
}

export interface MetadataCustomItem extends MetadataItem<React.ReactNode> {
  kind: 'custom';
}

type MetadataGroupItem = Omit<
  MetadataTextItem | MetadataCustomItem,
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
  | MetadataCustomItem
  | MetadataGroup;
