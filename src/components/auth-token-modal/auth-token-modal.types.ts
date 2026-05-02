export type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (token: string) => Promise<void> | void;
};
