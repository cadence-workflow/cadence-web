import { CRON_FIELD_ORDER } from '@/components/cron-schedule-input/cron-schedule-input.constants';
import parseCronExpression from '@/utils/cron-validate/parse-cron-expression';

import { EMPTY_CRON_EXPRESSION_FIELDS } from '../schedule-action-edit-form.constants';
import { type EditScheduleFormData } from '../schedule-action-edit-form.types';

export default function mapCronExpressionToFormFields(
  cronExpression: string | undefined
): EditScheduleFormData['cronExpression'] {
  const parsed = parseCronExpression(cronExpression || '');

  if (!parsed || parsed.timezone !== 'UTC') {
    return EMPTY_CRON_EXPRESSION_FIELDS;
  }

  const fields = parsed.expression.split(/\s+/);

  if (fields.length !== CRON_FIELD_ORDER.length) {
    return EMPTY_CRON_EXPRESSION_FIELDS;
  }

  return Object.fromEntries(
    CRON_FIELD_ORDER.map((field, index) => [field, fields[index]])
  ) as EditScheduleFormData['cronExpression'];
}
