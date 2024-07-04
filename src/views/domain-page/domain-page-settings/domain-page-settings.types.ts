import { type z } from 'zod';

import { type settingsFormSchema } from '../config/domain-page-settings-form.config';

export type SettingsValues = z.infer<typeof settingsFormSchema>;
