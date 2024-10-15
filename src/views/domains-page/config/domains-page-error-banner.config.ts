import { MdWarning } from 'react-icons/md';

import { type Props } from '../domains-page-error-banner/domains-page-error-banner.types';

const domainsPageErrorBannerConfig = {
  icon: MdWarning,
  getErrorMessage: ({ failedClusters }: Props) =>
    `Failed to fetch domains for following clusters: ${failedClusters.join(', ')}`,
};

export default domainsPageErrorBannerConfig;
