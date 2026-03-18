import DomainClusterSelector from '@/views/shared/domain-cluster-selector/domain-cluster-selector';

import {
  type DomainHeaderInfoItemContentProps,
  type DomainPageHeaderInfoItemsConfig,
} from '../domain-page-header-info/domain-page-header-info.types';
import getClusterOperationMode from '../helpers/get-cluster-operation-mode';

const domainPageHeaderInfoItemsConfig = [
  {
    title: 'Cluster',
    component: DomainClusterSelector,
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
