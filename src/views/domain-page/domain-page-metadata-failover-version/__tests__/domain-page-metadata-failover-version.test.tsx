import { render, screen } from '@/test-utils/rtl';

import { mockActiveActiveDomain } from '@/views/shared/active-active/__fixtures__/active-active-domain';

import { mockDomainDescription } from '../../__fixtures__/domain-description';
import DomainPageMetadataFailoverVersion from '../domain-page-metadata-failover-version';

jest.mock('@/views/shared/active-active/helpers/is-active-active-domain');

describe(DomainPageMetadataFailoverVersion.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders failover version as text for non-active-active domains', () => {
    render(<DomainPageMetadataFailoverVersion {...mockDomainDescription} />);

    expect(screen.getByText('123456')).toBeInTheDocument();
  });

  // TODO @adhitya.mamallan: add special rendering for failover versions for different cluster attributes
  it('temp: renders failover version as text for active-active domains', () => {
    render(<DomainPageMetadataFailoverVersion {...mockActiveActiveDomain} />);

    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
