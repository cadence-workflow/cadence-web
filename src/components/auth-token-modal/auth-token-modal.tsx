import React, { useEffect, useState } from 'react';

import { FormControl } from 'baseui/form-control';
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader,
} from 'baseui/modal';
import { Textarea } from 'baseui/textarea';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (token: string) => Promise<void> | void;
};

export default function AuthTokenModal({ isOpen, onClose, onSubmit }: Props) {
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setToken('');
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!token.trim()) {
      setError('Please paste a JWT token first');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(token.trim());
      setToken('');
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Failed to save authentication token'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      size="default"
      onClose={onClose}
      isOpen={isOpen}
      closeable={!isSubmitting}
      autoFocus
    >
      <ModalHeader>Authenticate with JWT</ModalHeader>
      <ModalBody>
        <FormControl
          label="Cadence JWT"
          caption="Paste a Cadence-compatible JWT issued by your identity provider."
          error={error || null}
        >
          <Textarea
            value={token}
            onChange={(event) =>
              setToken((event?.target as HTMLTextAreaElement)?.value || '')
            }
            clearOnEscape
            disabled={isSubmitting}
            rows={6}
          />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <ModalButton kind="tertiary" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </ModalButton>
        <ModalButton
          onClick={handleSubmit}
          isLoading={isSubmitting}
          data-testid="auth-token-submit"
        >
          Save token
        </ModalButton>
      </ModalFooter>
    </Modal>
  );
}
