import cron from 'cron-validate';
import { registerOptionPreset } from 'cron-validate/lib/option';
import { type InputOptions } from 'cron-validate/lib/types';

import {
  CRON_VALIDATE_CADENCE_PRESET,
  CRON_VALIDATE_CADENCE_PRESET_ID,
} from './cron-validate.constants';

registerOptionPreset(
  CRON_VALIDATE_CADENCE_PRESET_ID,
  CRON_VALIDATE_CADENCE_PRESET
);

export const cronValidate = (cronString: string, options?: InputOptions) => {
  return cron(cronString, {
    preset: CRON_VALIDATE_CADENCE_PRESET_ID,
    ...options,
  });
};
