import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { mockDomainInfo } from '../../__fixtures__/domain-info';
import domainPageHeaderInfoItemsConfig from '../../config/domain-page-header-info-items.config';
import { DomainPageContext } from '../../domain-page-context-provider/domain-page-context-provider';
import { type Props } from '../../domain-page-header-info-item/domain-page-header-info-item.types';
import DomainPageHeaderInfo from '../domain-page-header-info';

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
    render(
      <DomainPageContext.Provider
        value={{ pageConfig: { CLUSTERS_PUBLIC: [] } }}
      >
        <DomainPageHeaderInfo loading={true} />
      </DomainPageContext.Provider>
    );

    domainPageHeaderInfoItemsConfig.forEach((configItem) => {
      expect(screen.getByText(configItem.title)).toBeInTheDocument();
    });
    expect(screen.getAllByTestId('loading-spinner')).toHaveLength(
      domainPageHeaderInfoItemsConfig.length
    );
  });

  it('Should render all data after loading', () => {
    render(
      <DomainPageContext.Provider
        value={{ pageConfig: { CLUSTERS_PUBLIC: [] } }}
      >
        <DomainPageHeaderInfo
          loading={false}
          cluster="cluster_1"
          domainInfo={mockDomainInfo}
        />
      </DomainPageContext.Provider>
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
