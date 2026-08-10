import React from 'react';

import { StatefulTooltip } from 'baseui/tooltip';
import { MdHelpOutline } from 'react-icons/md';

import { styled } from './label-with-tooltip.styles';
import { type Props } from './label-with-tooltip.types';

export default function LabelWithTooltip({ label, tooltip }: Props) {
  return (
    <styled.Container>
      {label}
      {tooltip && (
        <StatefulTooltip
          placement="top"
          showArrow
          accessibilityType="tooltip"
          content={tooltip}
        >
          <styled.IconWrapper>
            <MdHelpOutline />
          </styled.IconWrapper>
        </StatefulTooltip>
      )}
    </styled.Container>
  );
}
