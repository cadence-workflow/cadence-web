import { type DomainMetadata } from '../hooks/use-suspense-domain-page-metadata.types';

interface MetadataItem<T> {
  key: string;
  label: string;
  kind: 'text' | 'custom';
  description?: string;
  getValue: (metadata: DomainMetadata) => T;
}

interface MetadataTextItem extends MetadataItem<string> {
  kind: 'text';
}

interface MetadataCustomItem extends MetadataItem<React.ReactNode> {
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
