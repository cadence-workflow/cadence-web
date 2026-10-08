import { type DetailsRowTooltipComponentProps } from '../workflow-history-details-row/workflow-history-details-row.types';

export type Props = DetailsRowTooltipComponentProps & {
  onClickOpenEvent?: () => void;
  isEventOpen?: boolean;
};
