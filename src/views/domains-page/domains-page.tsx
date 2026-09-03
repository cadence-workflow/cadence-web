'use client';
import React from 'react';

import DomainsPageContent from './domains-page-content/domains-page-content';
import DomainsPageContextProvider from './domains-page-context-provider/domains-page-context-provider';

export default function DomainsPage() {
  return (
    <DomainsPageContextProvider>
      <DomainsPageContent />
    </DomainsPageContextProvider>
  );
}
