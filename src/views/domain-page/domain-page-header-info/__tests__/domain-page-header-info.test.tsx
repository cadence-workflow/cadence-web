import React from 'react';
import { render, screen } from '@/test-utils/rtl';

import DomainPageHeaderInfo from '../domain-page-header-info';
import domainPageHeaderInfoItemsConfig from '../../config/domain-page-header-info-items.config';
import { mockDomainInfo } from '../../__fixtures__/domain-info';
import { type Props } from '../../domain-page-header-info-item/domain-page-header-info-item.types';

jest.mock(
  '../../domain-page-header-info-item/domain-page-header-info-item',
  () =>
    jest.fn((props: Props) => (
      <div>
        <div>{props.title}</div>
        <div>
          {props.loading ? (
            <div data-testid="loading-spinner" />
          ) : (
            props.content
          )}
        </div>
      </div>
    ))
);

jest.mock(
  '../../domain-page-cluster-selector/domain-page-cluster-selector',
  () => jest.fn(() => <div data-testid="mock-domain-cluster-selector" />)
);

describe(DomainPageHeaderInfo.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render in loading state', () => {
    render(<DomainPageHeaderInfo loading={true} />);

    domainPageHeaderInfoItemsConfig.forEach((configItem) => {
      expect(screen.getByText(configItem.title)).toBeInTheDocument();
    });
    expect(screen.getAllByTestId('loading-spinner')).toHaveLength(
      domainPageHeaderInfoItemsConfig.length
    );
  });

  it('Should render all data after loading', () => {
    render(
      <DomainPageHeaderInfo
        loading={false}
        cluster="cluster_1"
        domainInfo={mockDomainInfo}
      />
    );

    domainPageHeaderInfoItemsConfig.forEach((configItem) => {
      expect(screen.getByText(configItem.title)).toBeInTheDocument();
    });

    expect(
      screen.getByTestId('mock-domain-cluster-selector')
    ).toBeInTheDocument();
    expect(screen.getByText('Global')).toBeInTheDocument();
    expect(screen.getByText('mock-domain-staging-uuid')).toBeInTheDocument();
  });
});
