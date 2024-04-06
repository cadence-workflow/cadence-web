"use client"
import { LabelLarge } from 'baseui/typography';
import { Cell, Grid } from "baseui/layout-grid";

import useStyletronClasses from "@/hooks/use-styletron-classes";
import { cssStyles } from "./domains-page-title.styles";
import { ReactNode } from 'react';


type Props = {
  countBadge: ReactNode
}

export default function DomainPageTitle({ countBadge }: Props) {
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
