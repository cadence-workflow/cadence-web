/** Identity fields `/api/auth/me` can show. Groups stay server-side. */
export type AuthenticatedUserInfo = {
  id: string;
  userName: string;
  email?: string;
  pictureUrl?: string;
  isAdmin: boolean;
  groups: string[];
};
