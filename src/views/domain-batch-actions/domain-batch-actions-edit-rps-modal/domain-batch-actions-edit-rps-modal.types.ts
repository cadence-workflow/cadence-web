export type Props = {
  isOpen: boolean;
  currentRps: number | undefined;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (rps: number) => void;
};
