import { type AuthLogoutNotice } from '../auth.types';

export type HandleApiUnauthorizedContext = {
  /** Where the user returns to after a re-login; sanitized server-side. */
  returnTo?: string;
  notice?: AuthLogoutNotice;
  /** The 401 response, when called from the request() pipeline. */
  response?: Response;
};
