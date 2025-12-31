'use client';
import { HeadingMedium } from 'baseui/typography';
import Link from 'next/link';

import MarkdocRenderer from '@/components/markdoc/markdoc';

import { signalButtonGuide } from './content';
import { styled } from './page.styles';

export default function DocsPage() {
  return (
    <styled.PageContainer>
      <styled.Header>
        <Link href="/">
          <HeadingMedium>Cadence</HeadingMedium>
        </Link>
      </styled.Header>

      <styled.ContentContainer>
        <MarkdocRenderer content={signalButtonGuide} />
      </styled.ContentContainer>
    </styled.PageContainer>
  );
}
