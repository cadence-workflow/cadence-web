'use client';
import Markdown from '@/components/markdown/markdown';
import PageSection from '@/components/page-section/page-section';

import content from './content/markdown-guide';

export default function DocsPage() {
  return (
    <PageSection>
      <Markdown markdown={content} />
    </PageSection>
  );
}
