'use client';
import { createContext, useContext } from 'react';

export type MarkdownPageParams = {
  domain?: string;
  cluster?: string;
  workflowId?: string;
  runId?: string;
};

const MarkdownPageContext = createContext<MarkdownPageParams>({});

export const MarkdownPageContextProvider = MarkdownPageContext.Provider;

export function useMarkdownPageParams(): MarkdownPageParams {
  return useContext(MarkdownPageContext);
}
