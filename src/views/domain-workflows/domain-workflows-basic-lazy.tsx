'use client';
import dynamic from 'next/dynamic';

const DomainWorkflowsBasic = dynamic(
  () => import('@/views/domain-workflows-basic/domain-workflows-basic')
);

export default DomainWorkflowsBasic;
