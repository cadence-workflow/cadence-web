import { MdOutlineWarningAmber } from 'react-icons/md';

import { type ScheduleActionIcon } from '../schedule-actions.types';

export const pauseScheduleBannerIcon: ScheduleActionIcon = ({
  size,
  color,
}) => <MdOutlineWarningAmber size={size} color={color} />;
