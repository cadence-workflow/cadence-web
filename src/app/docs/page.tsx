'use client';
import { HeadingMedium } from 'baseui/typography';
import Link from 'next/link';

import MarkdocRenderer from '@/components/markdoc/markdoc';
import PageSection from '@/components/page-section/page-section';

import { signalButtonGuide } from './content';
import { styled } from './page.styles';

export default function DocsPage() {
  return (
    <PageSection>
      <styled.Header>
        <Link href="/">
          <HeadingMedium>Cadence</HeadingMedium>
        </Link>
      </styled.Header>

      <styled.ContentContainer>
        <MarkdocRenderer content={signalButtonGuide} />
      </styled.ContentContainer>
    </PageSection>
  );
}
