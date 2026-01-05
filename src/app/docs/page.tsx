'use client';
import { HeadingMedium } from 'baseui/typography';
import Link from 'next/link';

import Markdown from '@/components/markdown/markdown';
import PageSection from '@/components/page-section/page-section';

import content from './content/markdown-guide';
import { styled } from './page.styles';

export default function DocsPage() {
  return (
    <PageSection>
      <styled.Header>
        <Link href="/">
          <HeadingMedium>Cadence</HeadingMedium>
        </Link>
      </styled.Header>
      <Markdown markdown={content} />
    </PageSection>
  );
}
