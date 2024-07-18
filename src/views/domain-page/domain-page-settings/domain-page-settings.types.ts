import { type z } from 'zod';

import { type domainPageSettingsFormSchema } from '../config/domain-page-settings-form.config';

export type SettingsValues = z.infer<typeof domainPageSettingsFormSchema>;
