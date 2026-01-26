'use client';
import Markdown from '@/components/markdown/markdown';
import PageSection from '@/components/page-section/page-section';
import { markdownGuide } from '@/views/docs/markdown';

export default function DocsPage() {
  return (
    <PageSection>
      <Markdown markdown={markdownGuide} />
    </PageSection>
  );
}
