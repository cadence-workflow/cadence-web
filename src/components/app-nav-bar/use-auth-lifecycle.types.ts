export type UserMenuItem = {
  label: string;
  info: string;
};

export type AuthLifecycle = {
  isAuthEnabled: boolean;
  isValidToken: boolean;
  isAuthLoading: boolean;
  isAdmin: boolean;
  userName?: string;
  expiresAtMs?: number;
  saveToken: (token: string) => Promise<boolean>;
  logout: () => Promise<void>;
};
