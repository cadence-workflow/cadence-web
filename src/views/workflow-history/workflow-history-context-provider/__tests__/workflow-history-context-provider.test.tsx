import React, { useContext } from 'react';

import { render, screen, fireEvent } from '@/test-utils/rtl';

import * as localStorageModule from '@/utils/local-storage';

import workflowHistoryUserPreferencesConfig from '../../config/workflow-history-user-preferences.config';
import WorkflowHistoryContextProvider, {
  WorkflowHistoryContext,
} from '../workflow-history-context-provider';

const TestConsumer = () => {
  const context = useContext(WorkflowHistoryContext);
  return (
    <div>
      <div data-testid="ungrouped-preference">
        {context.ungroupedViewUserPreference === null
          ? 'null'
          : String(context.ungroupedViewUserPreference)}
      </div>
      <button onClick={() => context.setUngroupedViewUserPreference(true)}>
        Set Ungrouped True
      </button>
      <button onClick={() => context.setUngroupedViewUserPreference(false)}>
        Set Ungrouped False
      </button>
    </div>
  );
};

jest.mock('@/utils/local-storage', () => ({
  getLocalStorageValue: jest.fn(),
  setLocalStorageValue: jest.fn(),
  clearLocalStorageValue: jest.fn(),
}));

describe(WorkflowHistoryContextProvider.name, () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize with localStorage values', () => {
    const { mockGetLocalStorageValue } = setup({
      localStorageValues: {
        [workflowHistoryUserPreferencesConfig.ungroupedViewEnabled.key]: true,
      },
    });

    expect(mockGetLocalStorageValue).toHaveBeenCalledWith(
      workflowHistoryUserPreferencesConfig.ungroupedViewEnabled.key,
      workflowHistoryUserPreferencesConfig.ungroupedViewEnabled.schema
    );

    expect(screen.getByTestId('ungrouped-preference')).toHaveTextContent(
      'true'
    );
  });

  it('should initialize with null values when localStorage is empty', () => {
    const { mockGetLocalStorageValue } = setup();

    expect(mockGetLocalStorageValue).toHaveBeenCalledWith(
      workflowHistoryUserPreferencesConfig.ungroupedViewEnabled.key,
      workflowHistoryUserPreferencesConfig.ungroupedViewEnabled.schema
    );

    expect(screen.getByTestId('ungrouped-preference')).toHaveTextContent(
      'null'
    );
  });

  it('should update ungrouped view preference and localStorage', () => {
    const { mockSetLocalStorageValue } = setup();

    const setTrueButton = screen.getByText('Set Ungrouped True');
    fireEvent.click(setTrueButton);

    expect(mockSetLocalStorageValue).toHaveBeenCalledWith(
      workflowHistoryUserPreferencesConfig.ungroupedViewEnabled.key,
      'true'
    );
    expect(screen.getByTestId('ungrouped-preference')).toHaveTextContent(
      'true'
    );

    const setFalseButton = screen.getByText('Set Ungrouped False');
    fireEvent.click(setFalseButton);

    expect(mockSetLocalStorageValue).toHaveBeenCalledWith(
      workflowHistoryUserPreferencesConfig.ungroupedViewEnabled.key,
      'false'
    );
    expect(screen.getByTestId('ungrouped-preference')).toHaveTextContent(
      'false'
    );
  });

  it('should maintain state across re-renders', () => {
    const { rerender } = setup();

    const setTrueButton = screen.getByText('Set Ungrouped True');
    fireEvent.click(setTrueButton);

    expect(screen.getByTestId('ungrouped-preference')).toHaveTextContent(
      'true'
    );

    rerender();

    expect(screen.getByTestId('ungrouped-preference')).toHaveTextContent(
      'true'
    );
  });
});

function setup({
  localStorageValues = {},
}: {
  localStorageValues?: Record<string, any>;
} = {}) {
  const mockGetLocalStorageValue = jest.fn(
    (key) => localStorageValues[key] ?? null
  );
  const mockSetLocalStorageValue = jest.fn();
  const mockClearLocalStorageValue = jest.fn();

  jest
    .spyOn(localStorageModule, 'getLocalStorageValue')
    .mockImplementation(mockGetLocalStorageValue);
  jest
    .spyOn(localStorageModule, 'setLocalStorageValue')
    .mockImplementation(mockSetLocalStorageValue);
  jest
    .spyOn(localStorageModule, 'clearLocalStorageValue')
    .mockImplementation(mockClearLocalStorageValue);

  const TestConsumerWithProvider = (
    <WorkflowHistoryContextProvider>
      <TestConsumer />
    </WorkflowHistoryContextProvider>
  );

  const { rerender } = render(TestConsumerWithProvider);

  return {
    mockGetLocalStorageValue,
    mockSetLocalStorageValue,
    mockClearLocalStorageValue,
    rerender: () => rerender(TestConsumerWithProvider),
  };
}
