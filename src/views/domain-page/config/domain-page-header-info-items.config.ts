import DomainPageClusterSelector from '../domain-page-cluster-selector/domain-page-cluster-selector';
import {
  type DomainHeaderInfoItemContentProps,
  type DomainPageHeaderInfoItemsConfig,
} from '../domain-page-header-info/domain-page-header-info.types';

const domainPageHeaderInfoItemsConfig = [
  {
    title: 'Cluster',
    component: DomainPageClusterSelector,
    placeholderSize: '120px',
  },
  {
    title: 'Global/Local',
    getLabel: (props: DomainHeaderInfoItemContentProps) =>
      props.domainInfo.isGlobalDomain ? 'Global' : 'Local',
    placeholderSize: '64px',
  },
  {
    title: 'Domain ID',
    getLabel: (props: DomainHeaderInfoItemContentProps) => props.domainInfo.id,
    placeholderSize: '256px',
  },
] as const satisfies DomainPageHeaderInfoItemsConfig;

export default domainPageHeaderInfoItemsConfig;
