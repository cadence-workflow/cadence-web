import '@testing-library/jest-dom';

import { server } from '@/utils/msw/node';
import { clearTestQueryClient } from '@/test-utils/test-provider';

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