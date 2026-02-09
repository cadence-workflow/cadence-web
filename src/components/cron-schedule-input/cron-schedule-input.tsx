import React, { useCallback, useMemo, useState } from 'react';

import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Popover } from 'baseui/popover';
import cronstrue from 'cronstrue';

import CronScheduleInputPopover from './cron-schedule-input-popover/cron-schedule-input-popover';
import {
  CRON_FIELD_CONFIGS,
  CRON_FIELD_ORDER,
} from './cron-schedule-input.constants';
import { overrides, styled } from './cron-schedule-input.styles';
import type {
  CronScheduleInputProps,
  CronFieldType,
} from './cron-schedule-input.types';

export default function CronScheduleInput({
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  disabled = false,
}: CronScheduleInputProps) {
  const [openPopover, setOpenPopover] = useState<CronFieldType | null>(null);

  const handleFieldChange = useCallback(
    (fieldType: CronFieldType, newValue: string) => {
      onChange?.({ ...value, [fieldType]: newValue });
    },
    [onChange, value]
  );
  const handleFieldBlur = useCallback(
    (e: React.FocusEvent) => {
      setOpenPopover(null);
      onBlur?.(e);
    },
    [onBlur]
  );

  const handleFieldFocus = useCallback(
    (fieldType: CronFieldType, e: React.FocusEvent) => {
      setOpenPopover(fieldType);
      onFocus?.(e);
    },
    [onFocus]
  );

  const getFieldError = useCallback(
    (fieldType: CronFieldType) => {
      if (typeof error === 'string') {
        return true;
      }
      return Boolean(error?.[fieldType]);
    },
    [error]
  );

  const cronDescription = useMemo(() => {
    const cronExpression = CRON_FIELD_ORDER.map(
      (field) => value?.[field] || ''
    ).join(' ');

    const hasAllFields = CRON_FIELD_ORDER.every((field) => value?.[field]);
    if (!hasAllFields) return null;

    try {
      return cronstrue.toString(cronExpression);
    } catch {
      return null;
    }
  }, [value]);

  return (
    <styled.Container>
      {CRON_FIELD_ORDER.map((fieldType) => {
        const config = CRON_FIELD_CONFIGS[fieldType];
        const fieldValue = value?.[fieldType] || '';

        return (
          <styled.FieldContainer key={fieldType}>
            <FormControl label={config.label} overrides={overrides.formControl}>
              <Popover
                isOpen={openPopover === fieldType}
                placement="bottom"
                content={<CronScheduleInputPopover fieldType={fieldType} />}
                overrides={overrides.popover}
              >
                <div>
                  <Input
                    value={fieldValue}
                    aria-label={config.label}
                    onChange={(e) =>
                      handleFieldChange(fieldType, e.target.value)
                    }
                    onBlur={(e) => handleFieldBlur(e)}
                    onFocus={(e) => handleFieldFocus(fieldType, e)}
                    error={Boolean(getFieldError(fieldType))}
                    disabled={disabled}
                    overrides={overrides.input}
                    size="compact"
                  />
                </div>
              </Popover>
            </FormControl>
          </styled.FieldContainer>
        );
      })}
      {cronDescription && (
        <styled.Description>{cronDescription}</styled.Description>
      )}
    </styled.Container>
  );
}
