'use client';
import React from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import Form from '@/components/form/form';
import PageSection from '@/components/page-section/page-section';
import request from '@/utils/request';

import {
  settingsFormConfig,
  settingsFormSchema,
} from '../config/domain-page-settings-form.config';
import { type DomainPageTabContentProps } from '../domain-page-content/domain-page-content.types';
import { type DomainInfo } from '../domain-page.types';

import { styled } from './domain-page-settings.styles';

export default function DomainPageSettings(props: DomainPageTabContentProps) {
  const { data: domainInfo } = useSuspenseQuery<DomainInfo>({
    queryKey: ['describeDomain', props],
    queryFn: () =>
      request(`/api/domains/${props.domain}/${props.cluster}`).then((res) =>
        res.json()
      ),
  });

  return (
    <PageSection>
      <styled.SettingsContainer>
        <Form
          data={domainInfo}
          zodSchema={settingsFormSchema}
          formConfig={settingsFormConfig}
          // TODO @adhitya.mamallan: Update this with the domain update server action
          onSubmit={async (data) => {
            // Simulating an async request to cadence-frontend to set domain info for now
            await new Promise((resolve) => setTimeout(resolve, 4000));
            console.log('Submitted values', data);
          }}
          submitButtonText="Save settings"
        />
      </styled.SettingsContainer>
    </PageSection>
  );
}
