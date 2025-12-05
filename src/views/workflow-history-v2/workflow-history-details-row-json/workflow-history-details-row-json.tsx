import losslessJsonStringify from '@/utils/lossless-json-stringify';

import { type DetailsRowValueComponentProps } from '../workflow-history-details-row/workflow-history-details-row.types';

import { styled } from './workflow-history-details-row-json.styles';

export default function WorkflowHistoryDetailsRowJson({
  value,
  isNegative,
}: DetailsRowValueComponentProps) {
  return (
    <styled.JsonViewContainer $isNegative={isNegative ?? false}>
      {losslessJsonStringify(value)}
    </styled.JsonViewContainer>
  );
}
