import { render, screen } from '@/test-utils/rtl';

import DomainPageMetadataDescription from '../domain-page-metadata-description';

jest.mock('next/navigation', () => ({
  useParams: jest
    .fn()
    .mockReturnValue({ domain: 'test-domain', cluster: 'test-cluster' }),
}));

describe(DomainPageMetadataDescription.name, () => {
  it('displays the correct description', () => {
    render(<DomainPageMetadataDescription description="Test Description" />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('displays "No description" when description is empty', () => {
    render(<DomainPageMetadataDescription description="" />);
    expect(screen.getByText('No description')).toBeInTheDocument();
  });

  it('renders the edit button with correct link', () => {
    render(<DomainPageMetadataDescription description="Test Description" />);
    const button = screen.getByText('Edit in Settings');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute(
      'href',
      '/domains/test-domain/test-cluster/settings'
    );
  });
});
