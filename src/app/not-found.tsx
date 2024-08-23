'use client';
import { usePathname } from 'next/navigation';

import ErrorPanel from '@/components/error-panel/error-panel';

export default function NotFound() {
  const path = usePathname();

  return (
    <ErrorPanel
      message={`The page "${path}" could not be found`}
      actions={[
        {
          kind: 'link-internal',
          label: 'Go to domain overview',
          link: '/domains',
        },
      ]}
    />
  );
}
