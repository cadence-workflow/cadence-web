import { type Logger } from '../..';
import registerConsoleLogger from '../register-console-logger';
import { NEXTJS_ERROR_PREFIX } from '../register-console-logger.constants';
import { type ConsoleLogLevel } from '../register-console-logger.types';

describe(registerConsoleLogger.name, () => {
  it('should parse a regular console log correctly', () => {
    const { log, mockLogger } = setup('info');
    log(
      ' \u001b[32m\u001b[1m✓\u001b[22m\u001b[39m',
      'Test message',
      {
        key: 'value',
      },
      { key: 'another-value' }
    );

    expect(mockLogger.info).toHaveBeenCalledWith(
      {
        data: [{ key: 'value' }, { key: 'another-value' }],
      },
      '✓ Test message'
    );
  });

  it('should parse an error log correctly', () => {
    const { log, mockLogger } = setup('error');
    log(NEXTJS_ERROR_PREFIX, new Error('Something went wrong'));

    expect(mockLogger.error).toHaveBeenCalledWith(
      { errors: [new Error('Something went wrong')] },
      'Something went wrong'
    );
  });

  it('should parse errors correctly if multiple are logged', () => {
    const { log, mockLogger } = setup('error');
    log(
      NEXTJS_ERROR_PREFIX,
      new Error('Something went wrong'),
      new Error('Something else went wrong'),
      { key: 'value' }
    );

    expect(mockLogger.error).toHaveBeenCalledWith(
      {
        data: [{ key: 'value' }],
        errors: [
          new Error('Something went wrong'),
          new Error('Something else went wrong'),
        ],
      },
      'Something went wrong'
    );
  });
});

function setup(level: ConsoleLogLevel) {
  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  } as unknown as Logger;

  return {
    log: registerConsoleLogger(mockLogger, level),
    mockLogger,
  };
}
