'use client';
import { Cell, Grid } from 'baseui/layout-grid';
import { LabelLarge } from 'baseui/typography';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import { cssStyles } from './domains-page-title.styles';
import { type Props } from './domains-page-title.types';

export default function DomainsPageTitle({ countBadge }: Props) {
  const { cls } = useStyletronClasses(cssStyles);

  return (
    <section>
      <Grid>
        <Cell span={12}>
          <div className={cls.titleContainer}>
            <LabelLarge>All domains</LabelLarge>
            {countBadge}
          </div>
        </Cell>
      </Grid>
    </section>
  );
}
