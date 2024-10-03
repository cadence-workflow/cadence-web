import isObjectLike from 'lodash/isObjectLike';

import generateHistoryEventDetails from '../generate-history-event-details';
import getHistoryEventFieldRenderConfig from '../get-history-event-field-render-config';

jest.mock('../get-history-event-field-render-config', () => jest.fn());
jest.mock('lodash/isObjectLike', () => jest.fn());

const mockedGetHistoryEventFieldRenderConfig =
  getHistoryEventFieldRenderConfig as jest.Mock;

const mockedIsObjectLike = isObjectLike as jest.Mock;

describe('generateHistoryEventDetails', () => {
  const mockRenderConfig = { valueComponent: null, hide: jest.fn(() => false) };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns an empty array when event is null or undefined', () => {
    // @ts-expect-error testing null
    expect(generateHistoryEventDetails(null)).toEqual([]);
    // @ts-expect-error testing undefined
    expect(generateHistoryEventDetails(undefined)).toEqual([]);
  });

  it('flattens a simple object and returns WorkflowHistoryEventDetailsEntry array', () => {
    const mockEvent = {
      field1: 'value1',
      field2: 'value2',
    };

    mockedGetHistoryEventFieldRenderConfig.mockReturnValue(mockRenderConfig);

    const result = generateHistoryEventDetails(mockEvent);

    expect(result).toEqual([
      {
        key: 'field1',
        path: 'field1',
        value: 'value1',
        renderConfig: mockRenderConfig,
      },
      {
        key: 'field2',
        path: 'field2',
        value: 'value2',
        renderConfig: mockRenderConfig,
      },
    ]);
    expect(getHistoryEventFieldRenderConfig).toHaveBeenCalledTimes(2);
  });

  it('recursively flattens nested objects', () => {
    const mockEvent = {
      field1: {
        nestedField: 'nestedValue',
      },
      field2: 'value2',
    };

    mockedGetHistoryEventFieldRenderConfig.mockReturnValue(mockRenderConfig);
    mockedIsObjectLike.mockImplementation((value) => typeof value === 'object');

    const result = generateHistoryEventDetails(mockEvent);

    expect(result).toEqual([
      {
        key: 'nestedField',
        path: 'field1.nestedField',
        value: 'nestedValue',
        renderConfig: mockRenderConfig,
      },
      {
        key: 'field2',
        path: 'field2',
        value: 'value2',
        renderConfig: mockRenderConfig,
      },
    ]);
    expect(getHistoryEventFieldRenderConfig).toHaveBeenCalledTimes(3);
    expect(isObjectLike).toHaveBeenCalledWith(mockEvent.field1);
    expect(isObjectLike).toHaveBeenCalledWith(mockEvent.field1.nestedField);
  });

  it('skips fields where renderConfig.hide returns true', () => {
    const mockEvent = {
      field1: 'value1',
      field2: 'value2',
    };

    mockedGetHistoryEventFieldRenderConfig.mockReturnValue({
      hide: jest.fn(() => true),
    });

    const result = generateHistoryEventDetails(mockEvent);

    expect(result).toEqual([]);
    expect(getHistoryEventFieldRenderConfig).toHaveBeenCalledTimes(2);
  });

  it('pushes fields with non-object-like values into result', () => {
    const mockEvent = {
      field1: 'value1',
      field2: 42,
    };

    mockedGetHistoryEventFieldRenderConfig.mockReturnValue(mockRenderConfig);
    mockedIsObjectLike.mockReturnValue(false);

    const result = generateHistoryEventDetails(mockEvent);

    expect(result).toEqual([
      {
        key: 'field1',
        path: 'field1',
        value: 'value1',
        renderConfig: mockRenderConfig,
      },
      {
        key: 'field2',
        path: 'field2',
        value: 42,
        renderConfig: mockRenderConfig,
      },
    ]);
    expect(getHistoryEventFieldRenderConfig).toHaveBeenCalledTimes(2);
  });

  it('does not flatten non-object-like values', () => {
    const mockEvent = {
      field1: 'value1',
      field2: 42,
    };

    mockedGetHistoryEventFieldRenderConfig.mockReturnValue(mockRenderConfig);
    mockedIsObjectLike.mockImplementation((value) => typeof value === 'object');

    const result = generateHistoryEventDetails(mockEvent);

    expect(result).toEqual([
      {
        key: 'field1',
        path: 'field1',
        value: 'value1',
        renderConfig: mockRenderConfig,
      },
      {
        key: 'field2',
        path: 'field2',
        value: 42,
        renderConfig: mockRenderConfig,
      },
    ]);
  });
});
