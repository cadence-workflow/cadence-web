import type { MDXComponents } from 'mdx/types';

import MDXSignal from '@/components/mdx-signal/mdx-signal';
import MDXStart from '@/components/mdx-start/mdx-start';

// This file is used by Next.js to customize MDX rendering
// You can override how MDX renders HTML elements here
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Custom Cadence components for MDX
    Start: MDXStart,
    Signal: MDXSignal,
    // Add custom component mappings here if needed
    // Example:
    // h1: (props) => <h1 style={{ color: 'blue' }} {...props} />,
    ...components,
  };
}
