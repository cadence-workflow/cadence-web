import { MdArrowForward } from 'react-icons/md';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import { cssStyles } from './domain-page-failover-single-cluster.styles';
import { type Props } from './domain-page-failover-single-cluster.types';

export default function DomainPageFailoverSingleCluster({
  fromCluster,
  toCluster,
}: Props) {
  const { cls, theme } = useStyletronClasses(cssStyles);

  if (!fromCluster || !toCluster) return null;

  return (
    <div className={cls.failoverContainer}>
      {fromCluster}
      <MdArrowForward color={theme.colors.contentSecondary} />
      {toCluster}
    </div>
  );
}
