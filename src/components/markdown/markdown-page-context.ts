'use client';
import { createContext } from 'react';

export type MarkdownPageContextType = {
  domain?: string;
  cluster?: string;
  workflowId?: string;
  runId?: string;
};

export const MarkdownPageContext = createContext<MarkdownPageContextType>({});
