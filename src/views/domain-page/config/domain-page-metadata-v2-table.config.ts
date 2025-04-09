import DomainPageMetadataClusters from '../domain-page-metadata-clusters/domain-page-metadata-clusters';
import { type MetadataField } from '../domain-page-metadata-v2/domain-page-metadata-v2.types';

const domainPageMetadataV2TableConfig = [
  {
    key: 'domainId',
    label: 'Domain ID',
    kind: 'text',
    getValue: (domainInfo) => domainInfo.id,
  },
  {
    key: 'description',
    label: 'Description',
    kind: 'custom',
    // TODO: create a desc component
    getValue: DomainPageMetadataClusters,
  },
  {
    key: 'owner',
    label: 'Owner',
    kind: 'text',
    getValue: (domainInfo) => domainInfo.ownerEmail,
  },
  {
    key: 'environment',
    label: 'Environment',
    kind: 'group',
    items: [
      {
        key: 'clusters',
        label: 'Clusters',
        kind: 'custom',
        getValue: DomainPageMetadataClusters,
      },
      {
        key: 'globalOrLocal',
        label: 'Global/Local',
        kind: 'text',
        getValue: (domainInfo) =>
          domainInfo.isGlobalDomain ? 'Global' : 'Local',
      },
    ],
  },
  {
    key: 'failoverVersion',
    label: 'Failover version',
    kind: 'text',
    getValue: (domainInfo) => domainInfo.failoverVersion,
  },
  {
    key: 'describeDomainJson',
    label: 'DescribeDomain response',
    kind: 'custom',
    // TODO: create a JSON viewer component
    getValue: DomainPageMetadataClusters,
  },
] as const satisfies Array<MetadataField>;

export default domainPageMetadataV2TableConfig;
