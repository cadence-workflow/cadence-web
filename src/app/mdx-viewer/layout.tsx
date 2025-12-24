import type { ReactNode } from 'react';

import MDXViewerPage from '@/views/mdx-viewer-page/mdx-viewer-page';

export default function MDXViewerLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <MDXViewerPage>{children}</MDXViewerPage>;
}
