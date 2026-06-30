import { MdOutlineWarningAmber } from 'react-icons/md';

import { type ScheduleActionBannerIcon } from '../schedule-actions.types';

export const pauseScheduleBannerIcon: ScheduleActionBannerIcon = ({ size }) => (
  <MdOutlineWarningAmber size={size} />
);
