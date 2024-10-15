'use client';
import React from 'react';

import { Banner, KIND, HIERARCHY } from 'baseui/banner';

import PageSection from '@/components/page-section/page-section';

import domainsPageErrorBannerConfig from '../config/domains-page-error-banner.config';

import { overrides } from './domains-page-error-banner.styles';
import { type Props } from './domains-page-error-banner.types';

export default function DomainsPageErrorBanner({ failedClusters }: Props) {
  if (failedClusters.length === 0) return null;

  return (
    <PageSection>
      <Banner
        hierarchy={HIERARCHY.low}
        kind={KIND.negative}
        artwork={{ icon: domainsPageErrorBannerConfig.icon }}
        overrides={overrides.banner}
      >
        {domainsPageErrorBannerConfig.getErrorMessage({ failedClusters })}
      </Banner>
    </PageSection>
  );
}
