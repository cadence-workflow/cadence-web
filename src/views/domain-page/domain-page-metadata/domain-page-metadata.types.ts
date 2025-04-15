import {
  type ListTableNestedSimpleItem,
  type ListTableNestedSublistItem,
  type ListTableNestedGroup,
} from '@/components/list-table-nested/list-table-nested.types';

import { type DomainMetadata } from '../hooks/use-suspense-domain-page-metadata.types';

type MetadataSimpleItem = Omit<ListTableNestedSimpleItem, 'value'> & {
  getValue: (metadata: DomainMetadata) => React.ReactNode;
};

type MetadataSublistItem = Omit<ListTableNestedSublistItem, 'value'> & {
  getValue: (metadata: DomainMetadata) => React.ReactNode;
};

type MetadataGroup = Omit<ListTableNestedGroup, 'items'> & {
  items: Array<MetadataSublistItem>;
};

export type MetadataItem = MetadataSimpleItem | MetadataGroup;
