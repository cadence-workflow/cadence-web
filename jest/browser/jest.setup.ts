import '@testing-library/jest-dom';

import { server } from '@/utils/msw/node';
import { clearTestQueryClient } from '@/test-utils/test-provider';

// jsdom does not implement ResizeObserver. Nothing lays out in jsdom, so a stub
// that never reports a resize is enough for components that measure themselves;
// tests that need real dimensions mock the measuring hook instead.
if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  // Clear at a fixed point in Jest lifecycle so heap reflects released cache.
  clearTestQueryClient();
});

afterAll(() => {
  // Finally, disable API mocking after the tests are done.
  server.close()
})