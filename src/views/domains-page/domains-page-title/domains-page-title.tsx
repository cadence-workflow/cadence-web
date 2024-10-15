'use client';
import { LabelLarge } from 'baseui/typography';

import PageSection from '@/components/page-section/page-section';
import useStyletronClasses from '@/hooks/use-styletron-classes';

import { cssStyles } from './domains-page-title.styles';
import { type Props } from './domains-page-title.types';

export default function DomainsPageTitle({ countBadge }: Props) {
  const { cls } = useStyletronClasses(cssStyles);

  return (
    <PageSection>
      <div className={cls.titleContainer}>
        <LabelLarge>All domains</LabelLarge>
        {countBadge}
      </div>
    </PageSection>
  );
}
