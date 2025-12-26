import type { MDXComponents } from 'mdx/types';

import MDXSignal from '@/components/mdx-signal/mdx-signal';

// This file is used by Next.js to customize MDX rendering
// You can override how MDX renders HTML elements here
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Custom Cadence components for MDX
    Signal: MDXSignal,
    // Add custom component mappings here if needed
    // Example:
    // h1: (props) => <h1 style={{ color: 'blue' }} {...props} />,
    ...components,
  };
}
