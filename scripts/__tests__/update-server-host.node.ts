import { jest } from '@jest/globals';
import path from 'path';

const mockReadFileSync = jest.fn();
const mockWriteFileSync = jest.fn();

jest.mock('fs', () => ({
  readFileSync: mockReadFileSync,
  writeFileSync: mockWriteFileSync,
}));

const mockServerPath = '/mock/path/.next/standalone/server.js';

describe(' update-server-host script', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should successfully update server.js with new environment variables', () => {
    const mockServerContent = `
    const host = process.env.HOSTNAME;
    const port = process.env.PORT;
  `;

    const { mockExit, runScript } = setup({ content: mockServerContent });

    runScript();

    expect(mockExit).toHaveBeenCalledWith(0);

    expect(mockReadFileSync).toHaveBeenCalledWith(mockServerPath, 'utf8');

    expect(mockWriteFileSync).toHaveBeenCalledWith(
      mockServerPath,
      expect.stringContaining('process.env.CADENCE_WEB_HOSTNAME')
    );
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      mockServerPath,
      expect.stringContaining('process.env.CADENCE_WEB_PORT')
    );
  });

  it('should throw error if HOSTNAME is not found', () => {
    const contentWithoutHostname = `
      const port = process.env.PORT;
    `;

    const { mockExit, runScript } = setup({ content: contentWithoutHostname });

    runScript();

    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should throw error if PORT and HOSTNAME has more characters', () => {
    const contentWithoutPortAndHostname = `
      const port = process.env.PORT_1;
      const host = process.env.HOSTNAMES;
    `;

    const { mockExit, runScript } = setup({
      content: contentWithoutPortAndHostname,
    });

    runScript();

    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should throw error if PORT is not found', () => {
    const contentWithoutPort = `
      const host = process.env.HOSTNAME;
    `;

    const { mockExit, runScript } = setup({ content: contentWithoutPort });

    runScript();

    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should throw error if file read errors', () => {
    const { mockExit, runScript } = setup({
      content: '',
      readError: true,
    });

    runScript();

    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should throw error if file write errors', () => {
    const { mockExit, runScript } = setup({
      content: '',
      writeError: true,
    });

    runScript();

    expect(mockExit).toHaveBeenCalledWith(1);
  });
});

function setup({
  content,
  readError,
  writeError,
}: {
  content: string;
  readError?: boolean;
  writeError?: boolean;
}) {
  if (readError) {
    mockReadFileSync.mockImplementation(() => {
      throw new Error('File not found');
    });
  } else {
    mockReadFileSync.mockReturnValue(content);
  }

  if (writeError) {
    mockWriteFileSync.mockImplementation(() => {
      throw new Error('File not found');
    });
  } else {
    mockWriteFileSync.mockReturnValue(content);
  }

  jest.spyOn(process, 'cwd').mockReturnValue('/mock/path');
  jest.spyOn(path, 'join').mockReturnValue(mockServerPath);
  const mockExit = jest.spyOn(process, 'exit').mockResolvedValue(undefined);
  const runScript = () => require('../update-server-host.ts');
  return { mockExit, runScript };
}
