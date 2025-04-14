import {
  type ListTableV2SimpleItem,
  type ListTableV2SublistItem,
  type ListTableV2Group,
} from '@/components/list-table-v2/list-table-v2.types';

import { type DomainMetadata } from '../hooks/use-suspense-domain-page-metadata.types';

type MetadataSimpleItem = Omit<ListTableV2SimpleItem, 'value'> & {
  getValue: (metadata: DomainMetadata) => React.ReactNode;
};

type MetadataSublistItem = Omit<ListTableV2SublistItem, 'value'> & {
  getValue: (metadata: DomainMetadata) => React.ReactNode;
};

type MetadataGroup = Omit<ListTableV2Group, 'items'> & {
  items: Array<MetadataSublistItem>;
};

export type MetadataItem = MetadataSimpleItem | MetadataGroup;
