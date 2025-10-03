import { CRON_FIELD_ORDER } from '@/components/cron-schedule-input/cron-schedule-input.constants';
import { cronValidate } from '@/utils/cron-validate/cron-validate';
import { type CronData } from '@/utils/cron-validate/cron-validate.types';

import { type CronFieldsError } from '../workflow-action-start-form.types';

export const getCronFieldsError = (cronString: string): CronFieldsError => {
  const cronObj = cronValidate(cronString);

  if (!cronObj.isValid()) {
    const errors = cronObj.getError();
    const errorFieldsKeys = CRON_FIELD_ORDER;
    const fieldsErrors: Partial<Record<keyof CronData, string>> = {};
    errors.forEach((e) => {
      const errorKey = errorFieldsKeys.find((key) =>
        e.includes(`${key} field`)
      );
      if (errorKey) fieldsErrors[errorKey] = e;
    });

    if (!Object.keys(fieldsErrors).length) return { general: errors[0] };
    else return fieldsErrors;
  }

  return null;
};
