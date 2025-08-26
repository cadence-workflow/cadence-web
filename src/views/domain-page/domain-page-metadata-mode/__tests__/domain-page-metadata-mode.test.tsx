import { render, screen } from '@/test-utils/rtl';

import { mockActiveActiveDomain } from '@/views/shared/active-active/__fixtures__/active-active-domain';

import {
  mockDomainDescription,
  mockDomainDescriptionSingleCluster,
} from '../../__fixtures__/domain-description';
import DomainPageMetadataMode from '../domain-page-metadata-mode';

jest.mock('@/views/shared/active-active/helpers/is-active-active-domain');

describe(DomainPageMetadataMode.name, () => {
  it('renders Active-Active when domain is active-active', () => {
    render(<DomainPageMetadataMode {...mockActiveActiveDomain} />);

    expect(screen.getByText('Active-Active')).toBeInTheDocument();
  });

  it('renders Active-Passive when domain is global but not active-active', () => {
    render(<DomainPageMetadataMode {...mockDomainDescription} />);

    expect(screen.getByText('Active-Passive')).toBeInTheDocument();
  });

  it('renders Local when domain is not global', () => {
    render(
      <DomainPageMetadataMode
        {...{
          ...mockDomainDescriptionSingleCluster,
          isGlobalDomain: false,
        }}
      />
    );

    expect(screen.getByText('Local')).toBeInTheDocument();
  });
});
