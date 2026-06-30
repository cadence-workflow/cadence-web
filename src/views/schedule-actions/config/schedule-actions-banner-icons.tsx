import { MdOutlineWarningAmber } from 'react-icons/md';

import { type ScheduleActionIcon } from '../schedule-actions.types';

export const pauseScheduleBannerIcon: ScheduleActionIcon = ({ size }) => (
  <MdOutlineWarningAmber size={size} />
);
