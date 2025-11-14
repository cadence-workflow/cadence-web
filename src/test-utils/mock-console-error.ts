/*
 * Mocks console.error and silences known errors.
 *
 * Apply this utility to mute known errors and avoid polluting the test output.
 */
export const mockConsoleError = ({
  silencedErrorRegexes,
}: {
  silencedErrorRegexes: RegExp[];
}) => {
  // eslint-disable-next-line no-console
  const consoleError = console.error;

  const consoleErrorImpl = (...data: any[]) => {
    const dataString = data.toString();
    let shouldIgnore = false;

    for (const regex of silencedErrorRegexes) {
      if (regex.test(dataString)) {
        shouldIgnore = true;
        break;
      }
    }

    if (!shouldIgnore) {
      consoleError(...data);
    }
  };

  const spy = jest.spyOn(console, 'error').mockImplementation(consoleErrorImpl);

  return {
    restore: () => spy.mockRestore(),
  };
};
