import DomainPageClusterSelector from '../domain-page-cluster-selector/domain-page-cluster-selector';
import {
  type DomainHeaderInfoItemContentProps,
  type DomainPageHeaderInfoItemsConfig,
} from '../domain-page-header-info/domain-page-header-info.types';
import getClusterOperationMode from '../helpers/get-cluster-operation-mode';

const domainPageHeaderInfoItemsConfig = [
  {
    title: 'Cluster',
    component: DomainPageClusterSelector,
    placeholderSize: '120px',
  },
  {
    title: 'Mode',
    getLabel: (props: DomainHeaderInfoItemContentProps) =>
      getClusterOperationMode(props.domainDescription),
    placeholderSize: '64px',
  },
  {
    title: 'Domain ID',
    getLabel: (props: DomainHeaderInfoItemContentProps) =>
      props.domainDescription.id,
    placeholderSize: '256px',
  },
] as const satisfies DomainPageHeaderInfoItemsConfig;

export default domainPageHeaderInfoItemsConfig;
