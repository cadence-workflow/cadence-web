import * as workflowHistoryDetailsRowParsersConfigModule from '../../../config/workflow-history-details-row-parsers.config';
import { type EventDetailsEntries } from '../../../workflow-history-event-details/workflow-history-event-details.types';
import { type DetailsRowItemParser } from '../../workflow-history-details-row.types';
import getParsedDetailsRowItems from '../get-parsed-details-row-items';

// Mock the parser config
jest.mock('../../../config/workflow-history-details-row-parsers.config', () => {
  const mockIcon = jest.fn();
  const mockCustomRenderValue = jest.fn();
  const mockCustomTooltipContent = jest.fn();

  return {
    __esModule: true,
    default: [
      {
        name: 'Json Parser',
        matcher: (path: string, _value: unknown) =>
          path === 'input' || path === 'result',
        icon: null,
        customRenderValue: mockCustomRenderValue,
        customTooltipContent: mockCustomTooltipContent,
        invertTooltipColors: true,
      },
      {
        name: 'Timeout Parser',
        matcher: (path: string) => path.endsWith('TimeoutSeconds'),
        icon: mockIcon,
      },
      {
        name: 'Heartbeat Parser',
        matcher: (path: string) => path === 'lastHeartbeatTime',
        icon: mockIcon,
      },
      {
        name: 'Hidden Field Parser',
        matcher: (path: string) => path === 'hiddenField',
        icon: null,
        hide: jest.fn((_, value) => value === 'hide-me'),
      },
      {
        name: 'Attempt Parser',
        matcher: (path: string) => path === 'attempt',
        icon: mockIcon,
        customTooltipContent: jest.fn(() => 'retries'),
        omitWrapping: true,
      },
    ] satisfies Array<DetailsRowItemParser>,
  };
});

describe(getParsedDetailsRowItems.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty array when detailsEntries is empty', () => {
    const detailsEntries: EventDetailsEntries = [];

    const result = getParsedDetailsRowItems(detailsEntries);

    expect(result).toEqual([]);
  });

  it('should skip group entries', () => {
    const detailsEntries: EventDetailsEntries = [
      {
        key: 'groupField',
        path: 'groupField',
        renderConfig: {
          name: 'Test Config',
          key: 'test',
        },
        isGroup: true,
        groupEntries: [],
      },
      {
        key: 'regularField',
        path: 'regularField',
        value: 'test-value',
        renderConfig: {
          name: 'Test Config',
          key: 'test',
        },
        isGroup: false,
      },
    ];

    const result = getParsedDetailsRowItems(detailsEntries);

    expect(result).toHaveLength(1);
    expect(result[0].path).toBe('regularField');
  });

  it('should use parser config when matcher matches', () => {
    const detailsEntries: EventDetailsEntries = [
      {
        key: 'input',
        path: 'input',
        value: { data: 'test' },
        renderConfig: {
          name: 'Test Config',
          key: 'test',
        },
        isGroup: false,
      },
    ];

    const result = getParsedDetailsRowItems(detailsEntries);

    expect(result).toHaveLength(1);
    expect(result[0].path).toBe('input');
    expect(result[0].value).toEqual({ data: 'test' });
  });

  it('should exclude entries when hide function returns true', () => {
    const detailsEntries: EventDetailsEntries = [
      {
        key: 'hiddenField',
        path: 'hiddenField',
        value: 'hide-me',
        renderConfig: {
          name: 'Test Config',
          key: 'test',
        },
        isGroup: false,
      },
      {
        key: 'hiddenField',
        path: 'hiddenField',
        value: 'show-me',
        renderConfig: {
          name: 'Test Config',
          key: 'test',
        },
        isGroup: false,
      },
    ];

    const result = getParsedDetailsRowItems(detailsEntries);

    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('show-me');
  });

  it('should use customRenderValue from parser config when available', () => {
    const detailsEntries: EventDetailsEntries = [
      {
        key: 'input',
        path: 'input',
        value: { data: 'test' },
        renderConfig: {
          name: 'Test Config',
          key: 'test',
        },
        isGroup: false,
      },
    ];

    const result = getParsedDetailsRowItems(detailsEntries);

    expect(result).toHaveLength(1);
    expect(result[0].renderValue).toBe(
      workflowHistoryDetailsRowParsersConfigModule.default[0].customRenderValue
    );
  });

  it('should use renderConfig.valueComponent when no customRenderValue is available', () => {
    const mockValueComponent = jest.fn();
    const detailsEntries: EventDetailsEntries = [
      {
        key: 'regularField',
        path: 'regularField',
        value: 'test-value',
        renderConfig: {
          name: 'Test Config',
          key: 'test',
          valueComponent: mockValueComponent,
        },
        isGroup: false,
      },
    ];

    const result = getParsedDetailsRowItems(detailsEntries);

    expect(result).toHaveLength(1);
    expect(result[0].renderValue).toBeDefined();
  });

  it('should use icon from parser config when available', () => {
    const detailsEntries: EventDetailsEntries = [
      {
        key: 'lastHeartbeatTime',
        path: 'lastHeartbeatTime',
        value: 1234567890,
        renderConfig: {
          name: 'Test Config',
          key: 'test',
        },
        isGroup: false,
      },
    ];

    const result = getParsedDetailsRowItems(detailsEntries);

    expect(result).toHaveLength(1);
    expect(result[0].icon).toBe(
      workflowHistoryDetailsRowParsersConfigModule.default[2].icon
    );
  });

  it('should use null icon when parser config has no icon', () => {
    const detailsEntries: EventDetailsEntries = [
      {
        key: 'input',
        path: 'input',
        value: { data: 'test' },
        renderConfig: {
          name: 'Test Config',
          key: 'test',
        },
        isGroup: false,
      },
    ];

    const result = getParsedDetailsRowItems(detailsEntries);

    expect(result).toHaveLength(1);
    expect(result[0].icon).toBeNull();
  });

  it('should use customTooltipContent from parser config when available', () => {
    const detailsEntries: EventDetailsEntries = [
      {
        key: 'input',
        path: 'input',
        value: { data: 'test' },
        renderConfig: {
          name: 'Test Config',
          key: 'test',
        },
        isGroup: false,
      },
    ];

    const result = getParsedDetailsRowItems(detailsEntries);

    expect(result).toHaveLength(1);
    expect(result[0].renderTooltip).toBe(
      workflowHistoryDetailsRowParsersConfigModule.default[0]
        .customTooltipContent
    );
  });

  it('should use default tooltip function that returns label when no customTooltipContent is available', () => {
    const detailsEntries: EventDetailsEntries = [
      {
        key: 'regularField',
        path: 'regularField',
        value: 'test-value',
        renderConfig: {
          name: 'Test Config',
          key: 'test',
        },
        isGroup: false,
      },
    ];

    const result = getParsedDetailsRowItems(detailsEntries);

    expect(result).toHaveLength(1);
    expect(result[0].renderTooltip).toBeDefined();
    // renderTooltip should be a function that returns the label
    expect(typeof result[0].renderTooltip).toBe('function');
  });

  it('should use getLabel from renderConfig when available', () => {
    const detailsEntries: EventDetailsEntries = [
      {
        key: 'regularField',
        path: 'regularField',
        value: 'test-value',
        renderConfig: {
          name: 'Test Config',
          key: 'test',
          getLabel: ({ path }) => `Label: ${path}`,
        },
        isGroup: false,
      },
    ];

    const result = getParsedDetailsRowItems(detailsEntries);

    expect(result).toHaveLength(1);
    expect(result[0].label).toBe('Label: regularField');
  });

  it('should use path as label when getLabel is not available', () => {
    const detailsEntries: EventDetailsEntries = [
      {
        key: 'regularField',
        path: 'regularField',
        value: 'test-value',
        renderConfig: {
          name: 'Test Config',
          key: 'test',
        },
        isGroup: false,
      },
    ];

    const result = getParsedDetailsRowItems(detailsEntries);

    expect(result).toHaveLength(1);
    expect(result[0].label).toBe('regularField');
  });

  it('should include invertTooltipColors from parser config when available', () => {
    const detailsEntries: EventDetailsEntries = [
      {
        key: 'input',
        path: 'input',
        value: { data: 'test' },
        renderConfig: {
          name: 'Test Config',
          key: 'test',
        },
        isGroup: false,
      },
    ];

    const result = getParsedDetailsRowItems(detailsEntries);

    expect(result).toHaveLength(1);
    expect(result[0].invertTooltipColors).toBe(true);
  });

  it('should include omitWrapping from parser config when available', () => {
    const detailsEntries: EventDetailsEntries = [
      {
        key: 'attempt',
        path: 'attempt',
        value: 2,
        renderConfig: {
          name: 'Test Config',
          key: 'test',
        },
        isGroup: false,
      },
    ];

    const result = getParsedDetailsRowItems(detailsEntries);

    expect(result).toHaveLength(1);
    expect(result[0].omitWrapping).toBe(true);
  });
});
