export type UserMenuItem = {
  label: string;
  info: string;
};

export type AuthLifecycle = {
  isAuthEnabled: boolean;
  isAuthenticated: boolean;
  username: string | undefined;
  usernameSubtitle: string | undefined;
  userItems: UserMenuItem[] | undefined;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  saveToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};
