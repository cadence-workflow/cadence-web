'use client';
import React, { useMemo } from 'react';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import PrettyJson from '@/components/pretty-json/pretty-json';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import { formatScheduleInput } from '../config/schedule-details-formatters';
import SchedulePageDetailsSectionHeader from '../schedule-page-details-section-header/schedule-page-details-section-header';

import { cssStyles, overrides, styled } from './schedule-page-input-json.styles';
import { type Props } from './schedule-page-input-json.types';

const SECTION_TITLE = 'Schedule input';

export default function SchedulePageInputJson({ input }: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const parsedInput = useMemo(() => formatScheduleInput(input), [input]);

  const onToggle = React.useCallback(() => {
    setIsCollapsed((current) => !current);
  }, []);

  const textToCopy = useMemo(() => {
    if (parsedInput === null || parsedInput === undefined) {
      return '';
    }

    return losslessJsonStringify(parsedInput, null, '\t');
  }, [parsedInput]);

  if (parsedInput === null || parsedInput === undefined) {
    return null;
  }

  return (
    <section className={cls.section}>
      <SchedulePageDetailsSectionHeader
        title={SECTION_TITLE}
        isCollapsed={isCollapsed}
        onToggle={onToggle}
      />
      {!isCollapsed && (
        <div className={cls.jsonContainer}>
          <styled.JsonViewContainer>
            <styled.JsonViewHeader>
              <CopyTextButton
                textToCopy={textToCopy}
                overrides={overrides.copyButton}
              />
            </styled.JsonViewHeader>
            <PrettyJson json={parsedInput} />
          </styled.JsonViewContainer>
        </div>
      )}
    </section>
  );
}
