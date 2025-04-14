import downloadJson from '../download-json';

describe('downloadJson', () => {
  const originalCreateObjectURL = window.URL.createObjectURL;

  afterEach(() => {
    jest.clearAllMocks();
    window.URL.createObjectURL = originalCreateObjectURL;
  });

  it('should not execute when window is undefined', () => {
    const createObjectURLMock: jest.Mock = jest.fn();
    window.URL.createObjectURL = createObjectURLMock;

    // Temporarily remove window object
    const originalWindow = global.window;
    delete (global as any).window;

    downloadJson({ test: 'data' }, 'test-file');

    // Restore window object
    global.window = originalWindow;

    expect(createObjectURLMock).not.toHaveBeenCalled();
  });

  it('should create and trigger download of JSON file', () => {
    const createObjectURLMock: jest.Mock = jest.fn();
    window.URL.createObjectURL = createObjectURLMock;

    const testData = { test: 'data' };
    const filename = 'test-file';
    const mockBlobUrl = 'blob:test-url';

    createObjectURLMock.mockReturnValue(mockBlobUrl);

    downloadJson(testData, filename);

    expect(createObjectURLMock).toHaveBeenCalled();
  });
});
