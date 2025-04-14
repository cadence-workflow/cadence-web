import { type ModalProps } from 'baseui/modal';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { mockDomainDescription } from '../../__fixtures__/domain-description';
import DomainPageMetadataViewJson from '../domain-page-metadata-view-json';

const mockDownloadJson = jest.fn();
jest.mock('@/utils/download-json', () =>
  jest.fn((json, filename) => mockDownloadJson(json, filename))
);

jest.mock('baseui/modal', () => ({
  ...jest.requireActual('baseui/modal'),
  Modal: ({ isOpen, children }: ModalProps) =>
    isOpen ? (
      <div aria-modal aria-label="dialog" role="dialog">
        {typeof children === 'function' ? children() : children}
      </div>
    ) : null,
}));

describe(DomainPageMetadataViewJson.name, () => {
  it('renders the view JSON button', () => {
    setup();
    expect(screen.getByText('View JSON')).toBeInTheDocument();
  });

  it('opens modal when view JSON button is clicked', async () => {
    const { user } = setup();
    const viewButton = screen.getByText('View JSON');
    await user.click(viewButton);
    expect(screen.getByText('DescribeDomain response')).toBeInTheDocument();
  });

  it('displays domain description in JSON format', async () => {
    const { user } = setup();
    const viewButton = screen.getByText('View JSON');
    await user.click(viewButton);

    expect(screen.getByText('"mock-domain-staging"')).toBeInTheDocument();
    expect(screen.getByText('"mock-domain-staging-uuid"')).toBeInTheDocument();
  });

  it('downloads JSON when download button is clicked', async () => {
    const { user } = setup();
    const viewButton = screen.getByText('View JSON');
    await user.click(viewButton);

    const downloadButton = screen.getByTestId('download-json-button');
    await user.click(downloadButton);

    expect(mockDownloadJson).toHaveBeenCalledWith(
      mockDomainDescription,
      'mock-domain-staging-mock-domain-staging-uuid'
    );
  });

  it('closes modal when close button is clicked', async () => {
    const { user } = setup();
    const viewButton = screen.getByText('View JSON');
    await user.click(viewButton);

    const closeButton = screen.getByText('Close');
    await user.click(closeButton);

    expect(
      screen.queryByText('DescribeDomain response')
    ).not.toBeInTheDocument();
  });
});

function setup() {
  const user = userEvent.setup();
  const view = render(
    <DomainPageMetadataViewJson domainDescription={mockDomainDescription} />
  );
  return { user, ...view };
}
