/** Identity fields `/api/auth/me` can show. */
export type AuthenticatedUserInfo = {
  id: string;
  userName: string;
  email?: string;
  pictureUrl?: string;
  isAdmin: boolean;
};
