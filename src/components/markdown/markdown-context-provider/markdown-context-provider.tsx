'use client';
import { createContext, useCallback, useMemo, useState } from 'react';

import {
  type FieldMeta,
  type MarkdownContextType,
  type Props,
} from './markdown-context-provider.types';

export const MarkdownContext = createContext<MarkdownContextType>({});

export default function MarkdownContextProvider({
  domain,
  cluster,
  workflowId,
  runId,
  onActionSuccess,
  children,
}: Props) {
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [fieldMeta, setFieldMeta] = useState<Record<string, FieldMeta>>({});

  const setFieldValue = useCallback((name: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const registerField = useCallback(
    (name: string, meta: FieldMeta, defaultValue?: string) => {
      setFieldMeta((prev) => {
        const current = Object.hasOwn(prev, name) ? prev[name] : undefined;
        if (
          current &&
          current.type === meta.type &&
          current.required === meta.required
        ) {
          return prev;
        }
        return { ...prev, [name]: meta };
      });
      // Keep a value the user already typed, even if the field remounts.
      if (defaultValue !== undefined) {
        setFieldValues((prev) =>
          Object.hasOwn(prev, name) ? prev : { ...prev, [name]: defaultValue }
        );
      }
    },
    []
  );

  const unregisterField = useCallback((name: string) => {
    setFieldMeta((prev) => {
      if (!Object.hasOwn(prev, name)) return prev;
      const { [name]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      domain,
      cluster,
      workflowId,
      runId,
      onActionSuccess,
      fieldValues,
      fieldMeta,
      setFieldValue,
      registerField,
      unregisterField,
    }),
    [
      domain,
      cluster,
      workflowId,
      runId,
      onActionSuccess,
      fieldValues,
      fieldMeta,
      setFieldValue,
      registerField,
      unregisterField,
    ]
  );

  return (
    <MarkdownContext.Provider value={contextValue}>
      {children}
    </MarkdownContext.Provider>
  );
}
