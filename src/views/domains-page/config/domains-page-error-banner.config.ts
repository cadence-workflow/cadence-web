import { MdWarning } from 'react-icons/md';

import { getDomainsErrorMessage } from '../domains-page-error-banner/helpers/get-domains-error-message';

const domainsPageErrorBannerConfig = {
  icon: MdWarning,
  getErrorMessage: getDomainsErrorMessage,
};

export default domainsPageErrorBannerConfig;
